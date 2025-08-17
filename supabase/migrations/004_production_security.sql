-- Football Squares Platform - Production Security Settings
-- Run this AFTER 003_public_api_views.sql

-- ============================================
-- PRODUCTION HARDENING CHECKLIST
-- ============================================

-- 1. SSL ENFORCEMENT
-- Go to Supabase Dashboard > Settings > Database
-- Enable "Enforce SSL on incoming connections"

-- 2. NETWORK RESTRICTIONS  
-- Go to Supabase Dashboard > Settings > Database > Network Restrictions
-- Add your server IP addresses only

-- 3. DISABLE PUBLIC SCHEMA ACCESS (Optional but recommended)
-- Revoke default public schema access
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Grant specific access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- 4. API RATE LIMITING
-- Note: Configure this in Supabase Dashboard > Settings > API

-- 5. BACKUP CONFIGURATION
-- Note: Enable PITR in Supabase Dashboard > Settings > Database > Backups

-- ============================================
-- SECURITY FUNCTIONS
-- ============================================

-- Function to ban malicious users (Dean only)
CREATE OR REPLACE FUNCTION public.ban_user(
  p_user_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Verify caller is Dean
  SELECT id INTO v_agent_id
  FROM fsq_private.agents
  WHERE name = 'Dean' AND id = auth.uid();
  
  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Only Dean can ban users';
  END IF;
  
  -- Ban the user
  UPDATE fsq_private.users
  SET is_banned = TRUE
  WHERE id = p_user_id;
  
  -- Log the action
  PERFORM fsq_private.log_action(
    'ban_user', 
    'users', 
    p_user_id,
    jsonb_build_object('reason', p_reason, 'banned_by', v_agent_id)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to freeze a board (Jerry GM emergency override)
CREATE OR REPLACE FUNCTION public.freeze_board(
  p_board_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Verify caller is Jerry
  SELECT id INTO v_agent_id
  FROM fsq_private.agents
  WHERE name = 'Jerry' AND id = auth.uid();
  
  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Only Jerry (GM) can freeze boards';
  END IF;
  
  -- Freeze the board
  UPDATE fsq_private.boards
  SET status = 'cancelled'
  WHERE id = p_board_id;
  
  -- Log the action
  PERFORM fsq_private.log_action(
    'freeze_board', 
    'boards', 
    p_board_id,
    jsonb_build_object('reason', p_reason, 'frozen_by', v_agent_id)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MONITORING VIEWS (For Dean)
-- ============================================

-- Suspicious activity monitor
CREATE OR REPLACE VIEW fsq_private.suspicious_activity AS
SELECT 
  u.id as user_id,
  u.wallet_address,
  COUNT(DISTINCT t.board_id) as boards_participated,
  SUM(t.amount) as total_spent,
  MAX(t.created_at) as last_activity,
  CASE
    WHEN COUNT(DISTINCT t.board_id) > 10 THEN 'High board participation'
    WHEN SUM(t.amount) > 1000 THEN 'High spending'
    WHEN COUNT(*) FILTER (WHERE t.created_at > NOW() - INTERVAL '1 hour') > 20 THEN 'Rapid transactions'
    ELSE 'Normal'
  END as flag_reason
FROM fsq_private.users u
JOIN fsq_private.transactions t ON t.user_id = u.id
WHERE t.created_at > NOW() - INTERVAL '24 hours'
GROUP BY u.id, u.wallet_address
HAVING COUNT(*) > 5 OR SUM(t.amount) > 500;

-- Failed transaction monitor
CREATE OR REPLACE VIEW fsq_private.failed_transactions AS
SELECT 
  t.*,
  u.wallet_address,
  u.display_name,
  b.game_id
FROM fsq_private.transactions t
JOIN fsq_private.users u ON u.id = t.user_id
LEFT JOIN fsq_private.boards b ON b.id = t.board_id
WHERE t.status = 'failed'
  AND t.created_at > NOW() - INTERVAL '7 days'
ORDER BY t.created_at DESC;

-- ============================================
-- WEBHOOK TRIGGERS (For real-time updates)
-- ============================================

-- Enable realtime for public views
ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.squares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_results;

-- ============================================
-- CRON JOBS (Using pg_cron extension)
-- ============================================

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Auto-lock boards 5 minutes before game time
SELECT cron.schedule(
  'auto-lock-boards',
  '* * * * *', -- Every minute
  $$
    UPDATE fsq_private.boards
    SET status = 'locked', locked_at = NOW()
    WHERE status = 'open'
      AND game_date <= NOW() + INTERVAL '5 minutes'
      AND game_date > NOW();
  $$
);

-- Clean up old audit logs (keep 90 days)
SELECT cron.schedule(
  'cleanup-audit-logs',
  '0 2 * * *', -- Daily at 2 AM
  $$
    DELETE FROM fsq_private.audit_log
    WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

-- ============================================
-- FINAL SECURITY NOTES
-- ============================================

-- 1. NEVER expose service_role key in client code
-- 2. Always use anon key for client-side operations
-- 3. Implement rate limiting on API endpoints
-- 4. Monitor audit_log table regularly
-- 5. Set up alerts for suspicious_activity view
-- 6. Regular backups are CRITICAL
-- 7. Test disaster recovery procedures

-- ============================================
-- DEPLOYMENT COMPLETE!
-- ============================================
-- Your Supabase environment is now production-ready!
-- 
-- Next steps:
-- 1. Run these migrations in order in Supabase SQL Editor
-- 2. Configure SSL, network restrictions, and backups in Dashboard
-- 3. Test with your ElizaOS agents
-- 4. Monitor audit logs and suspicious activity
/**
 * Centralized icon exports to reduce import bloat
 * Organized by category for better maintainability
 */

// Navigation & UI
export {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Home,
  ExternalLink,
} from 'lucide-react';

// User & Account
export { User, Users, UserCheck, UserPlus, Settings } from 'lucide-react';

// Communication
export {
  Mail,
  MessageCircle,
  Phone,
  Send,
  Reply,
  Instagram,
} from 'lucide-react';

// Status & Feedback
export {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  RefreshCw,
  Loader2 as Loader,
} from 'lucide-react';

// Content & Media
export {
  FileText,
  Download,
  Upload,
  Copy,
  Edit,
  Trash,
  Save,
  Share,
} from 'lucide-react';

// Security & Privacy
export { Shield, Lock, Unlock, Eye, EyeOff, Key } from 'lucide-react';

// Technology & Web
export {
  Globe,
  Wifi,
  WifiOff,
  Activity,
  Hash,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Server,
} from 'lucide-react';

// Business & Commerce
export {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
} from 'lucide-react';

// Gaming & Sports
export {
  Trophy,
  Target,
  Gamepad,
  Star,
  Award,
  Flag,
  Crown,
  Square,
} from 'lucide-react';

// Time & Calendar
export { Calendar, Clock, Timer, History } from 'lucide-react';

// Actions & Controls
export {
  Play,
  PlayCircle,
  Pause,
  SkipForward,
  SkipBack,
  Volume,
  VolumeX,
} from 'lucide-react';

// Location & Geography
export { MapPin, Map, Navigation, Compass } from 'lucide-react';

// Tools & Utilities
export { Search, Filter, Grid, List, Wrench, Bug } from 'lucide-react';

// Miscellaneous
export {
  Heart,
  Bookmark,
  Tag,
  Bell,
  Gift,
  Zap,
  Flame,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';

// Legal & Compliance
export { Scale, Gavel, Building, Ban } from 'lucide-react';

// Re-export commonly used icon sets for specific domains
import {
  ArrowRight as _ArrowRight,
  ArrowLeft as _ArrowLeft,
  ChevronLeft as _ChevronLeft,
  ChevronRight as _ChevronRight,
  Home as _Home,
  ExternalLink as _ExternalLink,
} from 'lucide-react';

export const NavigationIcons = {
  ArrowRight: _ArrowRight,
  ArrowLeft: _ArrowLeft,
  ChevronLeft: _ChevronLeft,
  ChevronRight: _ChevronRight,
  Home: _Home,
  ExternalLink: _ExternalLink,
} as const;

import {
  CheckCircle as _CheckCircle,
  AlertCircle as _AlertCircle,
  AlertTriangle as _AlertTriangle,
  Info as _Info,
  HelpCircle as _HelpCircle,
  User as _User,
  Users as _Users,
  UserCheck as _UserCheck,
  Settings as _Settings,
  Shield as _Shield,
  Lock as _Lock,
  Eye as _Eye,
  EyeOff as _EyeOff,
} from 'lucide-react';

export const StatusIcons = {
  CheckCircle: _CheckCircle,
  AlertCircle: _AlertCircle,
  AlertTriangle: _AlertTriangle,
  Info: _Info,
  HelpCircle: _HelpCircle,
} as const;

export const UserIcons = {
  User: _User,
  Users: _Users,
  UserCheck: _UserCheck,
  Settings: _Settings,
} as const;

export const SecurityIcons = {
  Shield: _Shield,
  Lock: _Lock,
  Eye: _Eye,
  EyeOff: _EyeOff,
} as const;

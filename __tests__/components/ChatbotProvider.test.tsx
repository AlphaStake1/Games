import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import ChatbotProvider from '@/components/ChatbotProvider';

// Mock the navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the chatbot components
jest.mock('@/components/CoachBChatbot', () => {
  return function MockCoachBChatbot() {
    return <div data-testid="coach-b-chatbot">Coach B Chatbot</div>;
  };
});

jest.mock('@/components/OCPhilWidget', () => {
  return function MockOCPhilWidget() {
    return <div data-testid="oc-phil-widget">OC-Phil Widget</div>;
  };
});

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('ChatbotProvider', () => {
  const TestChildren = () => (
    <div data-testid="test-children">Test Content</div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Route-based chatbot switching', () => {
    it('renders CoachBChatbot on non-CBL routes', () => {
      mockUsePathname.mockReturnValue('/play');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();
    });

    it('renders CoachBChatbot on homepage', () => {
      mockUsePathname.mockReturnValue('/');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();
    });

    it('renders CoachBChatbot on rules page', () => {
      mockUsePathname.mockReturnValue('/rules');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();
    });

    it('renders CoachBChatbot on boards page', () => {
      mockUsePathname.mockReturnValue('/boards');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();
    });
  });

  describe('CBL route handling', () => {
    it('renders OCPhilWidget on /cbl/overview', () => {
      mockUsePathname.mockReturnValue('/cbl/overview');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('oc-phil-widget')).toBeInTheDocument();
      expect(screen.queryByTestId('coach-b-chatbot')).not.toBeInTheDocument();
    });

    it('renders OCPhilWidget on /cbl/dashboard', () => {
      mockUsePathname.mockReturnValue('/cbl/dashboard');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('oc-phil-widget')).toBeInTheDocument();
      expect(screen.queryByTestId('coach-b-chatbot')).not.toBeInTheDocument();
    });

    it('renders OCPhilWidget on any nested CBL route', () => {
      mockUsePathname.mockReturnValue('/cbl/settings/advanced');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('oc-phil-widget')).toBeInTheDocument();
      expect(screen.queryByTestId('coach-b-chatbot')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles route changes correctly', () => {
      mockUsePathname.mockReturnValue('/play');

      const { rerender } = render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();

      // Simulate route change to CBL
      mockUsePathname.mockReturnValue('/cbl/dashboard');

      rerender(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('oc-phil-widget')).toBeInTheDocument();
      expect(screen.queryByTestId('coach-b-chatbot')).not.toBeInTheDocument();
    });

    it('always renders children regardless of route', () => {
      mockUsePathname.mockReturnValue('/some/unknown/route');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
    });

    it('handles empty pathname', () => {
      mockUsePathname.mockReturnValue('');

      render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByTestId('coach-b-chatbot')).toBeInTheDocument();
      expect(screen.queryByTestId('oc-phil-widget')).not.toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('renders children before chatbot', () => {
      mockUsePathname.mockReturnValue('/play');

      const { container } = render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      const children = screen.getByTestId('test-children');
      const chatbot = screen.getByTestId('coach-b-chatbot');

      // Children should come before chatbot in DOM order
      expect(
        children.compareDocumentPosition(chatbot) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('maintains proper React fragment structure', () => {
      mockUsePathname.mockReturnValue('/play');

      const { container } = render(
        <ChatbotProvider>
          <TestChildren />
        </ChatbotProvider>,
      );

      // Should not add any wrapper elements
      expect(container.firstChild).toBe(screen.getByTestId('test-children'));
    });
  });
});

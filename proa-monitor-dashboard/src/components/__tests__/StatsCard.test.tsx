import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  const defaultProps = {
    icon: '📊',
    label: 'Test Label',
    value: '25.5',
  };

  it('should render with default props', () => {
    render(<StatsCard {...defaultProps} />);
    
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('25.5')).toBeInTheDocument();
  });

  it('should render with unit', () => {
    render(<StatsCard {...defaultProps} unit="°C" />);
    
    expect(screen.getByText('25.5')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('should render without unit', () => {
    render(<StatsCard {...defaultProps} />);
    
    expect(screen.getByText('25.5')).toBeInTheDocument();
    expect(screen.queryByText('°C')).not.toBeInTheDocument();
  });

  it('should render with numeric value', () => {
    render(<StatsCard {...defaultProps} value={42} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render with different icons', () => {
    const { rerender } = render(<StatsCard {...defaultProps} icon="🔥" />);
    expect(screen.getByText('🔥')).toBeInTheDocument();

    rerender(<StatsCard {...defaultProps} icon="❄️" />);
    expect(screen.getByText('❄️')).toBeInTheDocument();
  });

  it('should render with different labels', () => {
    const { rerender } = render(<StatsCard {...defaultProps} label="Temperature" />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();

    rerender(<StatsCard {...defaultProps} label="Humidity" />);
    expect(screen.getByText('Humidity')).toBeInTheDocument();
  });

  it('should render with complex values', () => {
    render(<StatsCard {...defaultProps} value="1,234.56" unit="%" />);
    
    expect(screen.getByText('1,234.56')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('should render with zero values', () => {
    render(<StatsCard {...defaultProps} value={0} unit="°C" />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('should render with negative values', () => {
    render(<StatsCard {...defaultProps} value={-5.2} unit="°C" />);
    
    expect(screen.getByText('-5.2')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<StatsCard {...defaultProps} />);
    
    const statCard = container.firstChild as HTMLElement;
    expect(statCard).toHaveClass('stat-card');
    
    const statIcon = screen.getByText('📊').parentElement;
    expect(statIcon).toHaveClass('stat-icon');
    
    const statContent = statIcon?.nextElementSibling;
    expect(statContent).toHaveClass('stat-content');
    
    const statLabel = screen.getByText('Test Label');
    expect(statLabel).toHaveClass('stat-label');
    
    const statValue = screen.getByText('25.5');
    expect(statValue).toHaveClass('stat-value');
  });

  it('should render unit with correct class when provided', () => {
    render(<StatsCard {...defaultProps} unit="°C" />);
    
    const statUnit = screen.getByText('°C');
    expect(statUnit).toHaveClass('stat-unit');
  });

  it('should handle empty string values', () => {
    render(<StatsCard {...defaultProps} value="" />);
    
    expect(screen.getByText('')).toBeInTheDocument();
  });

  it('should handle special characters in values', () => {
    render(<StatsCard {...defaultProps} value="∞" unit="∞" />);
    
    expect(screen.getByText('∞')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<StatsCard {...defaultProps} />);
    
    // Check that the component has semantic structure
    const statCard = screen.getByText('Test Label').closest('.stat-card');
    expect(statCard).toBeInTheDocument();
    
    // Check that text content is readable
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('25.5')).toBeInTheDocument();
  });
}); 
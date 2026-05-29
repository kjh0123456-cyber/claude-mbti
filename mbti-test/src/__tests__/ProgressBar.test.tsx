import { render, screen } from '@testing-library/react';
import ProgressBar from '../components/ProgressBar';

describe('ProgressBar', () => {
  it('aria-valuenow가 퍼센트로 설정됨', () => {
    render(<ProgressBar current={3} total={12} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('current / total 텍스트를 표시함', () => {
    render(<ProgressBar current={6} total={12} />);
    expect(screen.getByText('6 / 12')).toBeInTheDocument();
  });

  it('total이 0이면 0%로 처리', () => {
    render(<ProgressBar current={0} total={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('완료 시 100%', () => {
    render(<ProgressBar current={12} total={12} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});

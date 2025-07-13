// components/GlobalHeader.tsx
import { CurrentDate } from '../../../components/CurrentDate';
import './Header.css';

export default function GlobalHeader() {
  return (
    <div className="header">
      <div className="header__title">Proa-MetEdge-Dashboard</div>
      <div className="header__date">
        <CurrentDate />
      </div>
    </div>
  );
}

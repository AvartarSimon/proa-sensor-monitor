// components/CurrentDate.tsx
import moment from 'moment';
import { useEffect, useState } from 'react';
export function CurrentDate() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{moment(currentTime).format('DD/MM/YYYY HH:mm:ss')}</>;
}

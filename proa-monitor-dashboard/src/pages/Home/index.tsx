import Center from './center';
import Header from './header';
import LeftBlock1 from './left/Block1';
import LeftBlock2 from './left/Block2';
import LeftBlock3 from './left/Block3';
import RightBlock1 from './right/Block1';
import RightBlock2 from './right/Block2';
import RightBlock3 from './right/Block3';

import './Home.css';

export const Home = () => {
  return (
    <div className="home">
      <Center />
      <Header />
      <div className="home__content">
        <div className="home__left">
          <LeftBlock1 />
          <LeftBlock2 />
          <LeftBlock3 />
        </div>
        <div className="home__center-placeholder"></div>
        <div className="home__right">
          <RightBlock1 />
          <RightBlock2 />
          <RightBlock3 />
        </div>
      </div>
    </div>
  );
};

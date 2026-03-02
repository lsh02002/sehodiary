import styled from "styled-components";

import Home from "../../assets/home.svg";
import Inbox from "../../assets/inbox.svg";
import TaskList from "../../assets/task-list.svg";
import Settings from "../../assets/dashboard.svg";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <Container>
      <Wrapper>
        <IconLink to="/">
          <div>
            <img src={Home} alt="" />
          </div>
          <div>홈</div>
        </IconLink>
        <IconLink to={`/inbox`}>
          <div>
            <img src={Inbox} alt="" />
          </div>
          <div>인박스</div>
        </IconLink>
        <IconLink to={`/task-list`}>
          <div>
            <img src={TaskList} alt="" />
          </div>
          <div>나의 태스크들</div>
        </IconLink>
        <IconLink to="/settings">
          <div>
            <img src={Settings} alt="" />
          </div>
          <div>설정</div>
        </IconLink>
      </Wrapper>
    </Container>
  );
};

export default BottomNav;

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
  opacity: 1;
  z-index: 200;
  border-top: 1px solid lightgray;
  position: fixed !important;
  bottom: 0 !important;
  left: 0;
  right: 0;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 70px;
  font-size: 0.8rem;
  background-color: rgba(255, 255, 255, 1);
  a {
    text-decoration: none;
    color: black;
  }

  span {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-color: gray;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 14px;
    padding-left: 2px;
    position: absolute;
  }
`;

const IconLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-decoration: none;
  color: #777;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  img {
    width: 2rem;
    height: 2rem;
    margin-bottom: 4px;
  }

  /* active 상태일 때 텍스트/아이콘 색상 변경 */
  &.active {
    color: #4680ff;
    font-weight: 600;
    filter: invert(47%) sepia(79%) saturate(1448%) hue-rotate(194deg)
      brightness(103%) contrast(101%);
  }
`;

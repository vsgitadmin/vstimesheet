import Styled from "styled-components";
import css from "styled-jsx/css";

export const StyledTable = Styled.table`
  background-color: #ffff;
  border-radius: 10px;
  border-collapse: collapse;
  width: 100%;
  margin-top: 15px;
  box-shadow: 0px 0px 3px #eee;
  overflow-x: auto; /* add this */


th{
  border-bottom:2px solid #F4F4F4;
  font-weight:500;
  font-size:14px;
  color:#6B6F7B;
  text-align: left;
  height: 3rem;
  padding-left: 8px;
}
td{
    font-weight: 500;
    height: 3rem;
    padding-left: 8px;
}
tbody tr{
    border-bottom:1px solid #f4f4f4;
}

@keyframes glowing-border {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 72, 72, 0.7);
    border-radius : 5px ;
  }
  100% {
    box-shadow: 0 0 0 6px rgba(230, 72, 72, 0);
    border-radius : 5px ;
  }
}
.blinking{
  animation:glowing-border 1s infinite;
}

 `;

export const Flexspan = Styled.span`
 display: flex;align-items:center;
 > .table-img-wrapper{height:30px;width:30px;background-color:#f4f4f4;border-radius: 100%;margin-right:10px;display:flex;align-items:center;justify-content:center;};
 > .table-img-wrapper img{max-width:25px;}
 `;

export const Blockspan = Styled.span`
    display: block;
    color:${(props) => props.Fontcolor || "#313A4E"};
    font-size:14px;
    &:before{
${(props) =>
    props.Borderbefore &&
    css`
    content: "";
    border-radius: 100%;
    display: inline-flex;
    border: 4px solid;
    height: 8px;
    width: 8px;
    margin-right: 5px;
  `}
    
border-color:${(props) => props.Fontcolor};
    }
`;

export const Avatar = Styled.img`
    border-radius: 10px;
`;
export const Container = Styled.div`
width:100%;
`;

import Styled from 'styled-components'
import css from 'styled-jsx/css'

export const StyledTable=Styled.table`
background-color: #ffff;border-radius: 10px;border-collapse: collapse;width: 100%;margin-top:15px;box-shadow:0px 0px 3px #eee;
th{border-bottom:2px solid #F4F4F4;padding:15px 20px;font-weight:500;font-size:13px;color:#6B6F7B;text-align: left;}
td{padding: 15px 20px;font-weight: 500;}
tbody tr{border-bottom:1px solid #f4f4f4;}
tbody tr:last-child{border-bottom:0px;}
 `

 export const Flexspan=Styled.span`
 display: flex;align-items:center;
 > .table-img-wrapper{height:30px;width:30px;background-color:#f4f4f4;border-radius: 100%;margin-right:10px;display:flex;align-items:center;justify-content:center;};
 > .table-img-wrapper img{max-width:25px;}
 `

export const Blockspan=Styled.span`
    display: block;
    color:${props=> props.Fontcolor||"#313A4E"};
    
    &:before{
${props=>props.Borderbefore && css`
content:"";
border-radius:100%;
display:inline-flex;
border:4px solid;
height:8px;width:8px;margin-right:5px;
`}
    
border-color:${props=> props.Fontcolor};
    }
`   


export const Avatar=Styled.img`
    border-radius: 10px;
`
export const Container=Styled.div`
width:70%;margin-left:auto;margin-right:auto;
`
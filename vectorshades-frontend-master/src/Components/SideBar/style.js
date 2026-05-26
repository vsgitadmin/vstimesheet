import styled from "styled-components";

export const Parent = styled.section`
    width: 350px;
    height: 97vh;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    margin:15px;
    border-radius:10px;
    background-color:#ff0000ba;
`


export const TopParent = styled.div`
    border-bottom: 1px solid white;
    margin: 20px;
    padding-bottom: 17px;
`

export const TopParentText = styled.h1`
    font-size: 30px;
    text-align: center;
    color:white;
    font-family: 'Roboto', sans-serif;
`

export const UserParent = styled.div`
    display:flex;
    justify-content: center;
    padding: 10px;
`

export const UserParentImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`
export const UserParentTextParent = styled.div`
    
`

export const UserParentTextSubParent = styled.div`
    display:flex;
    align-items: center;
    gap:15px;

`


export const UserParentText = styled.h4`
    margin-bottom:3px;
    font-size: 15px;
    color:white;
    font-family: 'Open Sans', sans-serif;
`

export const UserParentSubText = styled.p`
    font-size:12px;
    color:grey;
`

export const LinkParent = styled.div`
    margin-top: 20px;

`
export const LinkParentChild = styled.div`
    display:flex;
    justify-content: center;
    align-items:center;
    gap:10px;
    padding: 11px;
    cursor:pointer;
    border-right: 4px solid transparent;

    &:hover{
        border-color:red;
        background-color: #ff000014;
    }
`

export const LinkParentIcon = styled.svg`
    font-size:10px;
`

export const LinkParentIconText = styled.h4`
    width: 150px;
    font-weight: 500;
    color:white;
    font-size: 18px;
    font-family: 'Open Sans', sans-serif;
`
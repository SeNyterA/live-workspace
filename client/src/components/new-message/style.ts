import styled from 'styled-components'

export const MessageStyle = styled.div`
  font-size: 14px;
  /* background-color: #aaa; */

  & h1 {
    font-size: 22px;
    margin-bottom: 8px;
  }

  & h2 {
    font-size: 20px;
    margin-bottom: 6px;
  }

  & h3 {
    font-size: 18px;
    margin-bottom: 4px;
  }

  & h4 {
    font-size: 16px;
  }

  & p {
    margin-bottom: 2px;
  }

  & ol {
    list-style: decimal;
    padding: 0 0 0 38px;
    margin: 5px 0 0;
  }

  & ul {
    padding: 0 0 0 38px;
    margin: 5px 0 0;
  }

  & [data-type='mention'] {
    background: #aaa;
  }
`

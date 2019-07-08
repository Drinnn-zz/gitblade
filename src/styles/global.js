import { createGlobalStyle } from "styled-components";

import "font-awesome/css/font-awesome.css";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Russo+One&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: 0;
    }

    body {
        background: #9b65e6;
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
        font-family: sans-serif;
    }

    h1 {
        color: white;
        font-family: 'Russo One', sans-serif;
    }
`;

export default GlobalStyle;

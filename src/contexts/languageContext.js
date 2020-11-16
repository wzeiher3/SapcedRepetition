  
import React from "react";

const languageContext = React.createContext({
    language: '',
    words: [],
    setLanguage: () => {},
    setWords: () => {},
});

export default languageContext;
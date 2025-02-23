// const Bubble = ({ message }) => {
//     const { content, role } = message
//     return (
//         <div className={`${role} bubble`}>{content}</div>
//     )
// }

// export default Bubble;



// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// const Bubble = ({ message }) => {
//     const { content, role } = message;
//     return (
//         <div className={`${role} bubble`}>
//             <ReactMarkdown>{content}</ReactMarkdown>
//         </div>
//     );
// };

// export default Bubble;

import React from "react";
import ReactMarkdown from "react-markdown";

const Bubble = ({ message }) => {
  const { content, role, model } = message;
  return (
    <div className={`${role} bubble`}>
      {model && <p className="model-label"></p>}
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Bubble;

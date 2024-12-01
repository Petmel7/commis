
// import React from 'react';

// const ErrorDisplay = ({ error }) => {
//     return (
//         <div>
//             <h2>Упс! Щось пішло не так.</h2>
//             <p>{error}</p>
//         </div>
//     );
// };

// export default ErrorDisplay;


import React from 'react';

const ErrorDisplay = ({ error }) => {
    const errorMessage =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Невідома помилка';

    return (
        <div>
            <h2>Упс! Щось пішло не так.</h2>
            <p>{errorMessage}</p>
        </div>
    );
};

export default ErrorDisplay;


// import { useState, useEffect } from "react";

// const useFetchDataWithArg = (fetchFunction, arg) => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (arg === null || arg === undefined) return; // Пропуск, якщо аргумент не задано

//             setLoading(true);
//             try {
//                 const result = await fetchFunction(arg);
//                 setData(result.data || result);
//             } catch (err) {
//                 setError(err.message || "An error occurred");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [fetchFunction, arg]);

//     return { data, loading, error };
// };

// export default useFetchDataWithArg;

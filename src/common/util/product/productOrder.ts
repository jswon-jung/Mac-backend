export const productOrder = ({
    data,
    order,
}: {
    data: any;
    order: string;
}) => {
    if (order === '최신순') {
        console.log(data);
    } else {
        // order === '인기순'
    }
};

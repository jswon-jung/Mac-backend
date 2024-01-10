export const getOrderNumber = (): string => {
    const randomNumber = Math.floor(
        10000000 + Math.random() * 90000000,
    );

    console.log('*******************');
    console.log(randomNumber);
    console.log(typeof randomNumber);
    console.log('*******************');

    return '';
};

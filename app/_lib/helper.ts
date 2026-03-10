export default class Helper {
    static handleOnlyNumber(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        const addCommaValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e.target.value = addCommaValue;
    }
}
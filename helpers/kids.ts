
export const getMonthDifference = (birthDate: Date, endDate: Date = new Date()) => {
    return (
        endDate.getMonth() -
        birthDate.getMonth() +
        12 * (endDate.getFullYear() - birthDate.getFullYear())
    )
}
export default function formatNumberEs(input:number) {
    // Check if the number is too small
    const absValue = Math.abs(input);
    const smallThreshold = 0.0001; // Define what "too low" means

    if (absValue > 0 && absValue < smallThreshold) {
        // Format in scientific notation for very small numbers
        return input.toExponential(2); // Keep two significant digits in scientific notation
    }

    // Otherwise, format with regular decimal representation
    return parseFloat(String(input)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });
}

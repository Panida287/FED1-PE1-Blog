
// Function to format date and time
export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

// Function to extract query parameter value
export function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

// Function to get URL parameters as an array
export function getQueryParamValues(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.getAll(parameter);
    return Array.isArray(paramValue) ? paramValue : [paramValue];
}

// Function to capitalize the first letter of a string
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to validate URL
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

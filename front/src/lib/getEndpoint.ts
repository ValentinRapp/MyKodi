export const getEndpoint = (): string => {
    try {
        const endpointData = JSON.parse(localStorage.getItem('endpoint_address') || '');
        return `http://${endpointData.address}:${endpointData.port}`;
    } catch (e) {
        return "http://localhost:2425"
    }
}
// Function to retrieve truthy value
export function convertToTruth (value: any): boolean {
    return typeof value !== 'undefined' && value !== null && String(value) !== '0' && value !== undefined
  }
  

// app/services/company_validation_service.ts
import axios from 'axios'
import env from '#start/env' 

interface CompaniesHouseResponse {
  company_name: string
  company_number: string
  company_status: string
  type: string
  date_of_creation?: string
  registered_office_address?: {
    address_line_1?: string
    locality?: string
    postal_code?: string
  }
}

export interface FirmDetails {
  "Organisation Name": string;
  "FRN": string;
  "Status": string;
  "Business Type": string;
  "Companies House Number"?: string;
  "Client Money Permission"?: string;
  "Status Effective Date"?: string;
  "System Timestamp"?: string;
  "Sub-Status"?: string;
  "Sub Status Effective from"?: string;
  "Mutual Society Number"?: string;
  "MLRs Status"?: string;
  "MLRs Status Effective Date"?: string;
  "PSD / EMD Status"?: string;
  "PSD / EMD Effective Date"?: string;
  "PSD Agent Status"?: string;
  "PSD Agent Effective date"?: string;
  "E-Money Agent Status"?: string;
  "E-Money Agent Effective Date"?: string;
  "Exceptional Info Details"?: any[];
  // Sub-endpoint URLs returned by the API
  "Name"?: string;
  "Individuals"?: string;
  "Requirements"?: string;
  "Permission"?: string;
  "Passport"?: string;
  "Regulators"?: string;
  "Appointed Representative"?: string;
  "Address"?: string;
  "Waivers"?: string;
  "Exclusions"?: string;
  "DisciplinaryHistory"?: string;
}

export interface FcaDataContainer {
  Status: string;
  Message: string;
  ResultInfo: {
    page: string;
    per_page: string;
    total_count: string;
  };
  Data: FirmDetails[]; // Typed array of firm details
}

export interface FcaApiResponse {
  message: string;
  status: string;
  data: FcaDataContainer;
}

/**
 * Validates a UK Company House Number against the official Gov.uk API
 * * @param companyNumber Raw company number input from the user (e.g., "6" or "00000006")
 */
export async function validateCompanyHouseNumber(companyNumber: string) {
  try {
    // 1. Clean input & Pad with leading zeros if it's less than 8 characters long
    let formattedNumber = companyNumber.trim().toUpperCase()
    
    // If it's purely numeric and short, pad it to 8 characters (e.g., "6" -> "00000006")
    if (/^\d+$/.test(formattedNumber)) {
      formattedNumber = formattedNumber.padStart(8, '0')
    }

    const apiKey = env.get('COMPANIES_HOUSE_API_KEY')
    if (!apiKey) {
      throw new Error('COMPANIES_HOUSE_API_KEY is missing in your environment configuration.')
    }

    // 2. Base64 encode the API key followed by a colon for Basic Authentication
    // Companies House uses the API key as the username and ignores the password.
    const token = Buffer.from(`${apiKey}:`).toString('base64')

    // 3. Dispatch HTTP request to Gov.uk
    const url = `https://api.company-information.service.gov.uk/company/${formattedNumber}`
    
    const response = await axios.get<CompaniesHouseResponse>(url, {
      headers: {
        'Authorization': `Basic ${token}`, // Basic auth with encoded key
        'Accept': 'application/json',
      },
    })

    const company = response.data

    return {
      isValid: true,
      company: {
        name: company.company_name,
        number: company.company_number,
        status: company.company_status, // e.g., "active", "dissolved"
        type: company.type,
        dateOfCreation: company.date_of_creation,
        address: company.registered_office_address,
      },
    }
  } catch (error) {
    // If the API returns a 404, the company number is invalid/does not exist
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        isValid: false,
        message: 'The company number provided is invalid or does not exist.',
      }
    }

    // Handle other errors (network failures, rate-limiting, invalid API Key)
    console.error('[COMPANIES HOUSE API ERROR]:',  error)
    throw new Error('Failed to verify company number with Companies House. Please try again later.')
  }
}

/**
 * Validates a Other Country Company ID Number against using Zephora.ai API
 * * @param companyNumber Raw company number input from the user (e.g., "6" or "00000006")
 */
export async function validateCompanyIdNumber(companyNumber: string) {
  try {
    // 1. Clean input & Pad with leading zeros if it's less than 8 characters long
    let formattedNumber = companyNumber.trim().toUpperCase()
    
    // If it's purely numeric and short, pad it to 8 characters (e.g., "6" -> "00000006")
    if (/^\d+$/.test(formattedNumber)) {
      formattedNumber = formattedNumber.padStart(8, '0')
    }

    const apiKey = env.get('COMPANIES_HOUSE_API_KEY')
    if (!apiKey) {
      throw new Error('COMPANIES_HOUSE_API_KEY is missing in your environment configuration.')
    }

    // 2. Base64 encode the API key followed by a colon for Basic Authentication
    // Companies House uses the API key as the username and ignores the password.
    const token = Buffer.from(`${apiKey}:`).toString('base64')

    // 3. Dispatch HTTP request to Gov.uk
    const url = `https://api.company-information.service.gov.uk/company/${formattedNumber}`
    
    const response = await axios.get<CompaniesHouseResponse>(url, {
      headers: {
        'Authorization': `Basic ${token}`, // Basic auth with encoded key
        'Accept': 'application/json',
      },
    })

    const company = response.data

    return {
      isValid: true,
      company: {
        name: company.company_name,
        number: company.company_number,
        status: company.company_status, // e.g., "active", "dissolved"
        type: company.type,
        dateOfCreation: company.date_of_creation,
        address: company.registered_office_address,
      },
    }
  } catch (error) {
    // If the API returns a 404, the company number is invalid/does not exist
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        isValid: false,
        message: 'The company number provided is invalid or does not exist.',
      }
    }

    // Handle other errors (network failures, rate-limiting, invalid API Key)
    console.error('[COMPANIES HOUSE API ERROR]:',  error)
    throw new Error('Failed to verify company number with Companies House. Please try again later.')
  }
}


/**
 * Validates a UK Firm Referencee Number against the official Gov.uk API
 * * @param firmReferenceNumber Raw company number input from the user (e.g., "6" or "00000006")
 */
export async function validateCompanyReferenceNumber(firmReferenceNumber: string) {
  try {
    // 1. Clean input & Pad with leading zeros if it's less than 8 characters long
    let formattedNumber = firmReferenceNumber.trim().toUpperCase()
    

    const apiEmail = env.get('FRN_API_EMAIL')
    const apiKey = env.get('FRN_API_KEY')
    if (!apiKey) {
      throw new Error('API key is missing in your environment configuration.')
    }
    if (!apiEmail) {
      throw new Error('API email is missing in your environment configuration.')
    }

    // 2. Base64 encode the API key followed by a colon for Basic Authentication
    // Companies House uses the API key as the username and ignores the password.

    // 3. Dispatch HTTP request to Gov.uk
    const url = `https://register.fca.org.uk/services/V0.1/Firm/${formattedNumber}`
    
    const response = await axios.get<FcaDataContainer>(url, {
      headers: {
        'Accept': 'application/json',
        'X-Auth-Email': apiEmail,
        'X-Auth-Key': apiKey,
      },
    })

    const company = response.data

    return {
      isValid: true,
      company: company.Data,
      name: company.Data?.[0]?.['Organisation Name'] ?? 'Name not found',
      message: company?.Message,
      status: company?.Status,
    }
  } catch (error) {
    // If the API returns a 404, the company number is invalid/does not exist
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        isValid: false,
        message: 'The company number provided is invalid or does not exist.',
      }
    }

    // Handle other errors (network failures, rate-limiting, invalid API Key)
    console.error('[FRN API ERROR]:',  error)
    throw new Error('Failed to verify company reference number. Please try again later.')
  }
}

export interface AppSettings{
    Serviceurl:string
}
export async function loadAppSettings(): Promise<Record<string, any>> {
    const response = await fetch('appsettings.json');
    if (!response.ok) {
      throw new Error('Failed to load configuration');
    }
   
    return response.json() ;
  }
export const handleDatabaseError = (error: any) => {
  if (error?.message?.includes('unique_verified_contact')) {
    return "מספר טלפון זה כבר אומת בעבר";
  }
  
  if (error?.message?.includes('PGRST116')) {
    return "קוד האימות שגוי או שפג תוקפו";
  }
  
  return error.message || "אירעה שגיאה בלתי צפויה";
};
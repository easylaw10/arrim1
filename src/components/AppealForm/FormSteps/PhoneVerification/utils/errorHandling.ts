export const handleDatabaseError = (error: any) => {
  if (error?.message?.includes('unique_verified_contact')) {
    return "מספר טלפון זה כבר אומת";
  }
  
  if (error?.message?.includes('23505')) {
    return "מספר טלפון זה כבר קיים במערכת";
  }
  
  if (error?.message?.includes('PGRST116')) {
    return "קוד האימות שגוי או שפג תוקפו";
  }
  
  return error.message || "אירעה שגיאה בלתי צפויה";
};
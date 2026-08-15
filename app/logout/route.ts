import {chatGPTSignOutPath} from "../chatgpt-auth";
export function GET(request:Request){
  const signOut=new URL(chatGPTSignOutPath("/login"),request.url);
  return Response.redirect(signOut,302);
}

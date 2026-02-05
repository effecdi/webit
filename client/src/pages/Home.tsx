import { Redirect } from "wouter";

// Default route redirects to Family mode for now, or Love mode as landing
export default function Home() {
  return <Redirect to="/love" />;
}

import { Container, Heading } from "@chakra-ui/react";
import { isRouteErrorResponse, Outlet, useRouteError } from "react-router-dom";
import { Header } from "../components/header";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container maxW='container.lg'>
      <Header />
      <Container maxW='container.md'>
        <div id="error-page">
          <Heading mb={5}>Oups!</Heading>
          <p>Désolé, une erreur est survenue</p>
          {isRouteErrorResponse(error) && (
            <>
              <p>
                <i>{error.status}</i>
              </p>
              <p>
                <i>{error.statusText}</i>
              </p>
              <p>
                <i>{typeof error.data === 'string' && error.data}</i>
              </p>
            </>
          )}
          {error instanceof Error && (
            <p>
              <i>{error.name}</i>
              <i>{error.message}</i>
            </p>
          )}
        </div>
      </Container>
    </Container>
  )
}
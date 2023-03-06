import { useForm } from "react-hook-form";
import { client } from "../../../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import { FeathersError } from "@feathersjs/errors/lib";

export const Login = () => {
  const navigate = useNavigate()

  const { handleSubmit, register, setError, formState: { errors } } = useForm();
  const onSubmit = async (values: { email: string, password: string }) => {
    try {
      await client.authenticate({
        strategy: 'local',
        ...values
      })
      navigate('/me/')
    }
    catch (error_) {
      const error = (error_ as FeathersError).toJSON()
      if (error.code === 401) {
        setError('email', { message: 'Invalid login or password' })
        setError('password', { message: 'Invalid login or password' })
        return
      }
    }

  };

  return (
    <Container>
      <Box mb={10}>
        <Heading>Connectez-vous pour commander</Heading>
        <Text fontSize={'xl'}>Ou commencez par vous <Link as={NavLink} to='/register' textDecoration={'underline'}>créer un compte</Link></Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={!!errors.email}>
            <FormLabel>Adresse email</FormLabel>
            <Input
              type='email'
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              })}
            />
            <FormErrorMessage>{errors.email && errors.email.message?.toString()}</FormErrorMessage>
          </FormControl>
          <FormControl mb={5} isInvalid={!!errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type='password'
              {...register("password", {
                required: "Required",
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit">Submit</Button>
          </Box>
        </>
      </form>
    </Container>
  );
}
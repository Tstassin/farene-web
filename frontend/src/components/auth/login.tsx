import { useForm } from "react-hook-form";
import { client } from "../../../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import { FeathersError } from "@feathersjs/errors/lib";
import { useAuthenticateMutation } from "../queries/authentication";

export const Login = () => {
  const navigate = useNavigate()
  const authenticationMutation = useAuthenticateMutation()

  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<{ email: string, password: string }>();

  const onSubmit = async (values: { email: string, password: string }) => {
    authenticationMutation.mutate(values)
  };

  if (authenticationMutation.isSuccess) {
    navigate('/me')
  }
  
  const formInvalid = Boolean(errors.root?.invalid)
  const emailInvalid = Boolean(errors.email) || formInvalid
  const passwordInvalid = Boolean(errors.password) || formInvalid

  if (authenticationMutation.isError) {
    if (authenticationMutation.error.code === 401) {
      !formInvalid && setError('root.invalid', { message: 'Adresse email ou mot de passe non valide' })
    }
    else {
      !formInvalid && setError('root.invalid', { message: authenticationMutation.error.message })
    }
  }


  return (
    <>
      <Box mb={10}>
        <Heading>Connectez-vous pour commander</Heading>
        <Text fontSize={'xl'}>Ou commencez par vous <Link as={NavLink} to='/register' textDecoration={'underline'}>créer un compte</Link></Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={emailInvalid}>
            <FormLabel>Adresse email</FormLabel>
            <Input
              type='email'
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email non valide"
                },
              })}
            />
            <FormErrorMessage>
              {
                errors.root?.invalid &&
                errors.root.invalid?.message?.toString()
              }
            </FormErrorMessage>
            <FormErrorMessage>{
              errors.email &&
              errors.email.message?.toString()
            }
            </FormErrorMessage>

          </FormControl>
          <FormControl mb={5} isInvalid={passwordInvalid}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type='password'
              {...register("password", {
                required: "Required",
              })}
            />
            <FormErrorMessage>
              {
                errors.root?.invalid &&
                errors.root.invalid?.message?.toString()
              }
            </FormErrorMessage>
            <FormErrorMessage>
              {
                errors.password &&
                errors.password.message?.toString()
              }
            </FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit">Se connecter</Button>
          </Box>
        </>
      </form>
    </>
  );
}
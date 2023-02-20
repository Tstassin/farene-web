import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { client } from "../../../api/api";

export const Register = () => {
  const navigate = useNavigate()

  const { handleSubmit, register, formState: { errors } } = useForm();
  const onSubmit = async (values: { email: string, password: string }) => {
    await client.service('users').create(values)
    await client.authenticate({
      strategy: 'local',
      ...values
    })
    navigate('/me/')
  };

  return (
    <>
      <Heading mb={10}>Register</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
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
            <FormLabel>Password</FormLabel>
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
    </>
  );
}
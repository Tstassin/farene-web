import { Controller, useForm } from "react-hook-form";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, PinInput, PinInputField, Text } from "@chakra-ui/react";
import { useChangePasswordMutation, useGenerateResetCodeMutation, useVerifyResetCodeMutation } from "../../queries/users";
import { useRef } from "react";
import { Link } from "react-router-dom";

export const ResetPassword = () => {
  const resetCode = useRef<number | null>(null)

  const generateResetCodeMutation = useGenerateResetCodeMutation()
  const generateResetCodeSubmit = async (values: { email: string }) => {
    (await generateResetCodeMutation).mutate(values)
  };
  const resetCodeGenerated = generateResetCodeMutation.isSuccess
  const email = generateResetCodeMutation.data?.email

  const verifyResetCodeMutation = useVerifyResetCodeMutation()
  const verifyResetCodeSubmit = async (values: { resetCode: string }) => {
    const resetCodeAsNumber = parseInt(values.resetCode)
    resetCode.current = resetCodeAsNumber;
    (await verifyResetCodeMutation).mutate({ resetCode: resetCodeAsNumber, email: email! })
  };
  const codeVerified = verifyResetCodeMutation.isSuccess

  const changePasswordMutation = useChangePasswordMutation()
  const changePasswordSubmit = async (values: { password: string }) => {
    console.log(values)
    const { password } = values;
    (await changePasswordMutation).mutate({ resetCode: resetCode.current!, password, email: email! })
  };
  const passwordChangedSuccess = changePasswordMutation.isSuccess

  return (
    <>
      <Box mb={10}>
        <Heading>Mot de passe oublié ?</Heading>
        {Boolean(email) ? <Text fontSize={'xl'}>Un code a été envoyé à {email}</Text> : <Text fontSize={'xl'}>Nous vous envoyons un code de réinitialisation</Text>}
      </Box>
      {
        passwordChangedSuccess
          ?
          <>
            <Heading size='md' mb={5}>Votre mot de passe a été mis à jour</Heading>
            <Button as={Link} to={'/login'}>Cliquez ici pour vous connecter</Button>
          </>
          :
          codeVerified
            ?
            <Step3ProvideNewPassword onSubmit={changePasswordSubmit} />
            :
            resetCodeGenerated
              ?
              <Step2ProvideGeneratedCode onSubmit={verifyResetCodeSubmit} />
              :
              <Step1ProvideEmail onSubmit={generateResetCodeSubmit} />
      }
    </>
  );
}

export const Step3ProvideNewPassword = ({ onSubmit }: { onSubmit: ({ password }: { password: string }) => Promise<void> }) => {
  const { handleSubmit, register, formState: { errors } } = useForm<{ password: string }>();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading size='md' mb={5}>Choisissez un nouvreau mot de passe</Heading>
        <Box>
          <FormControl mb={5}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type='password'
              {...register("password", {
                required: "Required",
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box>
          <Button type="submit">Changer mon mot de passe</Button>
        </Box>
      </form>
    </>
  )
}

export const Step2ProvideGeneratedCode = ({ onSubmit }: { onSubmit: ({ resetCode }: { resetCode: string }) => Promise<void> }) => {
  const { handleSubmit, register, control } = useForm<{ resetCode: string }>();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading size='md' mb={5}>Insérez le code</Heading>
        <Box>
          <HStack>
            <FormControl mb={5}>
              <Controller
                control={control}
                name='resetCode'
                render={({ field: { ref, ...restField } }) => (
                  <HStack>
                    <PinInput {...restField}>
                      <PinInputField ref={ref} />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                )} />
            </FormControl>
          </HStack>
        </Box>
        <Box>
          <Button type="submit">Vérifier le code</Button>
        </Box>
      </form>
    </>
  )
}

export const Step1ProvideEmail = ({ onSubmit }: { onSubmit: ({ email }: { email: string }) => Promise<void> }) => {
  const { handleSubmit, register, formState: { errors } } = useForm<{ email: string }>();
  const emailInvalid = Boolean(errors.email)

  return (
    <>
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
          <Box>
            <Button type="submit">Réinitialiser mon mot de passe</Button>
          </Box>
        </>
      </form>
    </>
  )
}
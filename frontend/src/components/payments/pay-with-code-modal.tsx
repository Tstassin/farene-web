import { FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { Order, OrderPayWithCode } from "../../../../backend/src/services/orders/orders.schema";
import { useOrderPayWithCodeMutation } from "../../queries/orders";
import { RequestButton } from "../elements/request-button";

interface PayWithCodeModalProps {
  orderId: Order['id'],
  isOpen: boolean
  closeAction: () => void
}

export const PayWithCodeModal = ({ orderId, isOpen, closeAction }: PayWithCodeModalProps) => {
  const orderPayWithCodeMutation = useOrderPayWithCodeMutation()

  const form = useForm<OrderPayWithCode>();
  const { handleSubmit, register, formState: { errors } } = form

  const onSubmit = async ({ code }: OrderPayWithCode) => {
    orderPayWithCodeMutation.mutate({ id: orderId, code })
  };
  
  orderPayWithCodeMutation.isSuccess && closeAction()

  return (
    <Modal isOpen={isOpen} onClose={closeAction}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payer avec un code professionnel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={5} isInvalid={orderPayWithCodeMutation.isError || Boolean(errors.code)}>
              <FormLabel>Votre code</FormLabel>
              <Input
                type='text'
                {...register('code', {
                  required: 'Ce champ est obligatoire'
                })}
              />
              <FormErrorMessage>
                {(orderPayWithCodeMutation.error as Error)?.message}
              </FormErrorMessage>
              <FormErrorMessage>
                {errors.code?.message}
              </FormErrorMessage>
            </FormControl>
            <RequestButton status={orderPayWithCodeMutation.status} type="submit" colorScheme={"blue"}>
              Payer
            </RequestButton>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
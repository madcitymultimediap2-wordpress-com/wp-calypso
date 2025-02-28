import { Button, Dialog } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { PaymentMethodSummary } from 'calypso/lib/checkout/payment-methods';
import useStoredCards from '../../hooks/use-stored-cards';
import DeletePrimaryCardConfirmation from './delete-primary-confirmation';
import type { PaymentMethod } from 'calypso/jetpack-cloud/sections/partner-portal/payment-methods';
import type { FunctionComponent } from 'react';

import './style.scss';

interface Props {
	paymentMethod: PaymentMethod;
	isVisible: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const StoredCreditCardDeleteDialog: FunctionComponent< Props > = ( {
	paymentMethod,
	isVisible,
	onClose,
	onConfirm,
} ) => {
	const translate = useTranslate();

	const { allStoredCards, isFetching } = useStoredCards();

	return (
		<Dialog
			isVisible={ isVisible }
			additionalClassNames="stored-credit-card-delete-dialog"
			onClose={ onClose }
			buttons={ [
				<Button disabled={ false } onClick={ onClose }>
					{ translate( 'Go back' ) }
				</Button>,

				<Button disabled={ isFetching } onClick={ onConfirm } primary scary>
					{ translate( 'Delete payment method' ) }
				</Button>,
			] }
		>
			<h2 className="stored-credit-card-delete-dialog__heading">
				{ translate( 'Delete payment method' ) }
			</h2>

			<p>
				{ translate(
					'The payment method {{paymentMethodSummary/}} will be removed from your account',
					{
						components: {
							paymentMethodSummary: (
								<strong>
									<PaymentMethodSummary
										type={ paymentMethod?.card.brand }
										digits={ paymentMethod?.card.last4 }
									/>
								</strong>
							),
						},
					}
				) }
			</p>

			{ paymentMethod.is_default && (
				<DeletePrimaryCardConfirmation
					card={ paymentMethod.card }
					altCard={
						( allStoredCards || [] ).find( ( card: PaymentMethod ) => card.id !== paymentMethod.id )
							?.card
					}
					isFetching={ isFetching }
				/>
			) }
		</Dialog>
	);
};

export default StoredCreditCardDeleteDialog;

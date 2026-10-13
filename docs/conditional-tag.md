# Promoções condicionais

O wrapper `cpf-recommended-products-wrapper` dispara `view_promotion` ao ficar visível, somente em REFF e FCDC. Os dois cards entram no mesmo `items`; rerenders não reenviam o evento. Título, descrição e URL vêm dos filhos TEXT/TEXT/NAVIGATION. A URL é `item_id`, sem currency, value, price ou SKU.

`dispatchAlert` representa falha de serviço; não dispara a impressão de sucesso.

-- Inserção para STATUS
INSERT INTO  `STATUS` (`NOME`) VALUES
  ('PAGO'),
  ('PENDENTE'),
  ('AGENDADO'),
  ('CANCELADO');


-- Inserção para PAYMENT_TYPE
INSERT INTO `PAYMENT_TYPE` (`NOME`) VALUES
  ('Credito em conta'),
  ('Boleto'),
  ('Debito Automático'),
  ('Conta corrente'),
  ('Dinheiro'),
  ('Contra-cheque'),
  ('Cartão de Crédito'),
  ('Cartão de Débito'),
  ('PIX');

-- Inserção para CATEGORIA
INSERT INTO `CATEGORIA` (`NOME`, `DESCRICAO`) VALUES
  ('LAZER', 'Gastos com lazer'),
  ('RECORRENTE', 'Alimentação, contas básicas, escola, plano de saúde, etc...'),
  ('BENS MATERIAIS', 'Qualquer bem adquirido.'),
  ('EXTRA', 'Gastos com manutenções de bens, ou imprevistos.');
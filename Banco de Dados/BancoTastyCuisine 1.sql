CREATE DATABASE TASTYCUISINE
GO
USE TASTYCUISINE
GO

CREATE TABLE Usuario (
    Cod_user INT IDENTITY(1,1) PRIMARY KEY,
    Nome_completo NVARCHAR(300) NOT NULL,
    Idade DATE NOT NULL,
    Gmail NVARCHAR(255) NOT NULL UNIQUE,
    Senha NVARCHAR(250) NOT NULL,
    Status_Usuario NVARCHAR(20) NOT NULL default 'ATIVO',
    Bloqueado BIT NOT NULL Default 0,
    Restricoes_alimentares NVARCHAR(MAX) default 'lactose' NULL,
    foto_perfil NVARCHAR(MAX) NULL,
    funcao NVARCHAR(30) NOT NULL, -- Chefe ou Usuario,

    CONSTRAINT CHK_idade CHECK (DATEADD(year, 14, Idade) <= GETDATE()) -- ve se o caba tem mais de 14 anos
);

CREATE TABLE Categorias (
    Cod_Categoria INT IDENTITY(1,1) PRIMARY KEY,
    Nome_Categoria NVARCHAR(100) NOT NULL,
    Grupo NVARCHAR(30) NOT NULL DEFAULT 'neutro'
);

CREATE TABLE Receitas (
    Cod_receitas INT IDENTITY(1,1) PRIMARY KEY,
    Nome_receita NVARCHAR(250) NOT NULL,
    Descricao NVARCHAR(250) NOT NULL,
    Modo_preparo NVARCHAR(MAX) NOT NULL,
    Ingredientes NVARCHAR(MAX) NOT NULL,
    Cod_usuario INT NOT NULL,
    Foto_receita NVARCHAR(MAX),
    Restricao INT NOT NULL,
    Status_Receita NVARCHAR(20) NOT NULL default 'INATIVO',
    TempoPreparo NVARCHAR(20) NOT NULL,
    FOREIGN KEY (Cod_usuario) REFERENCES Usuario(Cod_user),
    CONSTRAINT chk_ingredientes CHECK (Ingredientes IS NULL OR ISJSON(Ingredientes) = 1),
    CONSTRAINT chk_modo_preparo CHECK (ISJSON(Modo_preparo) = 1)
);

CREATE TABLE Favoritos (
    Cod_favoritos BIGINT IDENTITY(1,1) PRIMARY KEY,
    Cod_user INT NOT NULL,
    Cod_receitas INT NOT NULL,
    FOREIGN KEY (Cod_user) REFERENCES Usuario(Cod_user),
    FOREIGN KEY (Cod_receitas) REFERENCES Receitas(Cod_receitas)
);

CREATE TABLE Comentarios (
    Cod_comentarios BIGINT IDENTITY(1,1) PRIMARY KEY,
    Cod_user INT NOT NULL,
    Cod_receitas INT NOT NULL,
    Nota INT NOT NULL CHECK (Nota BETWEEN 1 AND 5),
    Data_Comentario DATETIME DEFAULT GETDATE(),
    Status_Comentarios NVARCHAR(20) NOT NULL default 'ATIVO',
    FOREIGN KEY (Cod_user) REFERENCES Usuario(Cod_user),
    FOREIGN KEY (Cod_receitas) REFERENCES Receitas(Cod_receitas)
);

CREATE TABLE Livros(
    Cod_Livros INT IDENTITY(1,1) PRIMARY KEY,
    Nome_Livro NVARCHAR(50) NOT NULL,
    Foto_Livro NVARCHAR(MAX) NULL,
    Cod_User INT NOT NULL,
       
    FOREIGN KEY (Cod_User) REFERENCES Usuario(Cod_user),
);

CREATE TABLE Livro_Receitas(
    Cod_Livros INT NOT NULL,
    Cod_Receita INT NOT NULL
)

CREATE TABLE Receitas_Categorias(
    Cod_Categoria INT NOT NULL,
    Cod_Receita INT NOT NULL
    FOREIGN KEY (Cod_receita)   REFERENCES Receitas(Cod_receitas),
    FOREIGN KEY (Cod_Categoria) REFERENCES Categorias(Cod_Categoria)
)

GO
INSERT INTO Categorias (Nome_Categoria, Grupo) VALUES 
  ('Massas', 'neutro'),
  ('Sobremesas', 'neutro'),
  ('Lanches e Petiscos', 'neutro'),
  ('Sopas e Caldos', 'neutro'),
  ('Saladas', 'vegetariano'),
  ('Carnes', 'carnes'),
  ('Aves', 'carnes'),
  ('Peixes e Frutos do Mar', 'carnes'),
  ('Vegetariana', 'vegetariano'),
  ('Vegana', 'vegano'),
  ('Bebidas e Drinks', 'neutro'),
  ('Café da Manhã', 'neutro'),
  ('Pães e Bolos', 'neutro'),
  ('Fitness e Saudável', 'neutro'),
  ('Molhos e Acompanhamentos', 'neutro');


insert into Usuario(Nome_completo,Idade,Gmail,Senha,Restricoes_alimentares,funcao)
VALUES('eu','2000/08/20','gmail@gmail.com','123456','[]','Usuario')

INSERT INTO receitas (
    Nome_receita, 
    Descricao, 
    Modo_preparo, 
    Ingredientes, 
    Cod_usuario, 
    Foto_receita, 
    Restricao, 
    Status_Receita
) VALUES 
('Bolo de Cenoura', 'Clássico bolo de cenoura fofinho com cobertura de chocolate.', 
 '["Bata as cenouras, ovos e óleo no liquidificador", "Misture a farinha e o açúcar em uma tigela", "Junte as misturas e adicione o fermento", "Asse em forno preaquecido a 180°C por 40 min", "Faça a calda de chocolate e cubra o bolo"]', 
 '[{"nome": "Cenoura", "quantidade": "3", "unidade": "unidades"}, {"nome": "Ovo", "quantidade": "3", "unidade": "unidades"}, {"nome": "Óleo", "quantidade": "1/2", "unidade": "xícara"}, {"nome": "Açúcar", "quantidade": "2", "unidade": "xícaras"}, {"nome": "Farinha de Trigo", "quantidade": "2.5", "unidade": "xícaras"}, {"nome": "Fermento em pó", "quantidade": "1", "unidade": "colher de sopa"}]', 
 1, NULL, 15, 'ATIVO'),

('Panqueca de Banana', 'Panqueca prática de 2 ingredientes para o café da manhã.', 
 '["Amasse bem a banana em um prato", "Misture o ovo batido com a banana", "Aqueça uma frigideira antiaderente untada", "Pingue porções da massa e doure dos dois lados"]', 
 '[{"nome": "Banana madura", "quantidade": "1", "unidade": "unidade"}, {"nome": "Ovo", "quantidade": "1", "unidade": "unidade"}, {"nome": "Canela em pó", "quantidade": "1", "unidade": "pitada"}]', 
 1, NULL, 15, 'ATIVO'),

('Omelete de Queijo e Tomate', 'Omelete cremosa ideal para uma refeição rápida.', 
 '["Bata os ovos com sal e pimenta em uma tigela", "Despeje na frigideira aquecida em fogo baixo", "Adicione o queijo e o tomate picados de um lado", "Dobre ao meio e espere o queijo derreter"]', 
 '[{"nome": "Ovo", "quantidade": "2", "unidade": "unidades"}, {"nome": "Queijo Muçarela", "quantidade": "50", "unidade": "gramas"}, {"nome": "Tomate", "quantidade": "1/2", "unidade": "unidade"}, {"nome": "Sal", "quantidade": "1", "unidade": "pitada"}]', 
 1, NULL, 15, 'ATIVO'),

('Salada Ceasar Simples', 'Salada leve com molho caseiro e tiras de frango.', 
 '["Grelhe o peito de frango temperado e corte em tiras", "Lave e corte o alface-americana", "Misture a maionese com o limão e o queijo ralado para o molho", "Monte a salada juntando o alface, o frango, os croutons e o molho"]', 
 '[{"nome": "Alface-americana", "quantidade": "1", "unidade": "maço"}, {"nome": "Peito de Frango", "quantidade": "200", "unidade": "gramas"}, {"nome": "Croutons", "quantidade": "50", "unidade": "gramas"}, {"nome": "Queijo Parmesão", "quantidade": "30", "unidade": "gramas"}]', 
 1, NULL, 15, 'ATIVO'),

('Sopa de Legumes', 'Sopa reconfortante de legumes variados.', 
 '["Descasque e corte todos os legumes em cubos pequenos", "Refogue a cebola e o alho em uma panela grande", "Adicione os legumes e cubra com água", "Cozinhe até ficarem macios e ajuste o sal"]', 
 '[{"nome": "Batata", "quantidade": "2", "unidade": "unidades"}, {"nome": "Cenoura", "quantidade": "1", "unidade": "unidade"}, {"nome": "Chuchu", "quantidade": "1", "unidade": "unidade"}, {"nome": "Cebola", "quantidade": "1/2", "unidade": "unidade"}]', 
 1, NULL, 15, 'ATIVO'),

('Vitamina de Morango', 'Bebida rápida e refrescante para a tarde.', 
 '["Lave bem os morangos e retire as folhas", "Adicione os morangos, o leite e o mel no liquidificador", "Bata por 2 minutos até ficar homogêneo", "Sirva bem gelado"]', 
 '[{"nome": "Morango", "quantidade": "10", "unidade": "unidades"}, {"nome": "Leite", "quantidade": "250", "unidade": "ml"}, {"nome": "Mel", "quantidade": "1", "unidade": "colher de sopa"}]', 
 1, NULL, 15, 'ATIVO'),

('Escondidinho de Carne Moída', 'Prato tradicional com purê de batata e recheio suculento.', 
 '["Cozinhe as batatas e amasse-as fazendo um purê leve", "Refogue a carne moída com alho, cebola e temperos a gosto", "Em um refratário, faça uma camada de purê, depois a carne e cubra com o restante do purê", "Finalize com queijo ralado e leve ao forno para gratinar"]', 
 '[{"nome": "Carne Moída", "quantidade": "400", "unidade": "gramas"}, {"nome": "Batata", "quantidade": "6", "unidade": "unidades"}, {"nome": "Queijo Muçarela", "quantidade": "100", "unidade": "gramas"}, {"nome": "Manteiga", "quantidade": "1", "unidade": "colher de sopa"}]', 
 1, NULL, 15, 'ATIVO'),

('Macarrão ao Alho e Óleo', 'Massa rápida e cheia de sabor com alho dourado.', 
 '["Cozinhe o macarrão em água fervente com sal até ficar al dente", "Em uma frigideira, doure o alho laminado no azeite", "Junte o macarrão escorrido na frigideira e misture bem", "Polvilhe cheiro-verde picado antes de servir"]', 
 '[{"nome": "Macarrão Spaghetti", "quantidade": "250", "unidade": "gramas"}, {"nome": "Alho", "quantidade": "4", "unidade": "dentes"}, {"nome": "Azeite de Oliva", "quantidade": "3", "unidade": "colheres de sopa"}, {"nome": "Sal", "quantidade": "1", "unidade": "colher de chá"}]', 
 1, NULL, 15, 'ATIVO'),

('Crepioca de Frango', 'Opção saudável e proteica para o jantar.', 
 '["Bata a goma de tapioca com o ovo até misturar bem", "Despeje em uma frigideira aquecida e cozinhe os dois lados", "Recheie com o frango desfiado temperado", "Dobre ao meio e sirva quente"]', 
 '[{"nome": "Goma de Tapioca", "quantidade": "2", "unidade": "colheres de sopa"}, {"nome": "Ovo", "quantidade": "1", "unidade": "unidade"}, {"nome": "Frango desfiado", "quantidade": "3", "unidade": "colheres de sopa"}]', 
 1, NULL, 15, 'ATIVO'),

('Mousse de Maracujá', 'Sobremesa cremosa com apenas 3 ingredientes.', 
 '["Bata o leite condensado, o creme de leite e o suco concentrado de maracujá no liquidificador por 3 minutos", "Despeje em taças individuais ou em um refratário", "Leve à geladeira por pelo menos 3 horas antes de servir"]', 
 '[{"nome": "Leite Condensado", "quantidade": "1", "unidade": "lata"}, {"nome": "Creme de Leite", "quantidade": "1", "unidade": "caixinha"}, {"nome": "Suco concentrado de maracujá", "quantidade": "200", "unidade": "ml"}]', 
 1, NULL, 15, 'ATIVO'),

('Guacamole Tradicional', 'Acompanhamento mexicano fresco e prático.', 
 '["Amasse o abacate com um garfo deixando alguns pedaços", "Misture o tomate, a cebola e o coentro bem picados", "Tempere com o suco de limão, azeite e sal", "Misture delicadamente e sirva com tortillas"]', 
 '[{"nome": "Abacate", "quantidade": "1", "unidade": "unidade"}, {"nome": "Tomate", "quantidade": "1", "unidade": "unidade"}, {"nome": "Cebola Roxa", "quantidade": "1/2", "unidade": "unidade"}, {"nome": "Limão", "quantidade": "1", "unidade": "unidade"}]', 
 1, NULL, 15, 'ATIVO'),

('Misto Quente de Frigideira', 'Lanche clássico para qualquer hora do dia.', 
 '["Passe manteiga do lado de fora das fatias de pão", "Monte o lanche com uma fatia de queijo e uma de presunto", "Coloque na frigideira aquecida em fogo baixo", "Vire quando estiver dourado e espere o queijo derreter"]', 
 '[{"nome": "Pão de Forma", "quantidade": "2", "unidade": "fatias"}, {"nome": "Queijo Muçarela", "quantidade": "1", "unidade": "fatia"}, {"nome": "Presunto", "quantidade": "1", "unidade": "fatia"}, {"nome": "Manteiga", "quantidade": "1", "unidade": "colher de chá"}]', 
 1, NULL, 15, 'ATIVO'),

('Batata Sauté', 'Acompanhamento leve de batatas douradas na manteiga.', 
 '["Cozinhe as batatas cortadas em cubos grandes até ficarem al dente", "Derreta a manteiga em uma frigideira larga", "Adicione as batatas escorridas e doure mexendo ocasionalmente", "Finalize com salsa picada e sal"]', 
 '[{"nome": "Batata", "quantidade": "4", "unidade": "unidades"}, {"nome": "Manteiga", "quantidade": "2", "unidade": "colheres de sopa"}, {"nome": "Salsinha", "quantidade": "1", "unidade": "colher de sopa"}, {"nome": "Sal", "quantidade": "1", "unidade": "pitada"}]', 
 1, NULL, 15, 'ATIVO'),

('Smoothie de Banana e Cacau', 'Bebida cremosa perfeita para o pré-treino.', 
 '["Descasque a banana e congele na véspera", "Bata no liquidificador a banana congelada com o leite e o cacau", "Adicione a aveia e bata até ficar cremoso", "Sirva imediatamente"]', 
 '[{"nome": "Banana", "quantidade": "1", "unidade": "unidade"}, {"nome": "Leite", "quantidade": "200", "unidade": "ml"}, {"nome": "Cacau em pó 100%", "quantidade": "1", "unidade": "colher de sopa"}, {"nome": "Aveia em flocos", "quantidade": "1", "unidade": "colher de sopa"}]', 
 1, NULL, 15, 'ATIVO'),

('Arroz de Forno Cremoso', 'Receita para aproveitar o arroz do dia anterior.', 
 '["Misture o arroz cozido com o requeijão e o milho", "Em um refratário, alterne camadas de arroz, presunto e queijo", "Cubra a última camada com queijo e polvilhe orégano", "Leve ao forno a 200°C por 15 minutos até gratinar"]', 
 '[{"nome": "Arroz cozido", "quantidade": "3", "unidade": "xícaras"}, {"nome": "Requeijão Cremoso", "quantidade": "200", "unidade": "gramas"}, {"nome": "Milho verde", "quantidade": "1/2", "unidade": "lata"}, {"nome": "Queijo Muçarela", "quantidade": "150", "unidade": "gramas"}]', 
 1, NULL, 15, 'ATIVO');

insert into livros(Nome_Livro,Cod_User)
values('edurado',1)

insert into Livro_Receitas(Cod_Livros,Cod_Receita)
values(1,1)

insert into Receitas_Categorias(Cod_Categoria,Cod_Receita)
values(1,1)
GO
 
SELECT * FROM Usuario
Select * From Comentarios
select * from Categorias
select * from Receitas
select * from Favoritos
select * from Livros    
SELECT * FROM Livro_Receitas;
select * from Receitas_Categorias

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Livros';

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Receitas';

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Receitas';

SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Receitas_Categorias'

package com.tastycuisine.TastyCuisineV2.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tastycuisine.TastyCuisineV2.model.entity.Usuario;
import com.tastycuisine.TastyCuisineV2.model.repository.UsuarioRepository;
import com.tastycuisine.TastyCuisineV2.model.service.UsuarioService;

import java.security.SecureRandom;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public AdminInitializer(UsuarioRepository usuarioRepository, UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    public void run(String... args) throws Exception {
        String emailAdmin = "admin@tastycuisine.com";

        // Verifica se já existe um admin para não duplicar toda vez que subir a
        // aplicação

        // Gera uma senha aleatória de 6 dígitos numéricos
        String senhaAleatoria = gerarSenhaAleatoria6Digitos();

        Usuario admin = new Usuario();
        admin.setIdade(18);
        admin.setNome_completo("ADM_name");
        admin.setNome_de_usuario("ADM_user");
        admin.setGmail(emailAdmin);
        admin.setSenha(senhaAleatoria);
        admin.setFuncao("ADMIN");
        admin = usuarioService.save(admin);
        usuarioRepository.save(admin);

        // Exibe no console para você conseguir copiar e testar o login
        System.out.println("==================================================");
        System.out.println("ADMINISTRADOR CRIADO COM SUCESSO!");
        System.out.println("E-mail: " + emailAdmin);
        System.out.println("Senha temporária (6 dígitos): " + senhaAleatoria);
        System.out.println("==================================================");
    }

    private String gerarSenhaAleatoria6Digitos() {
        SecureRandom random = new SecureRandom();
        int numero = random.nextInt(900000) + 100000; // Gera um número entre 100000 e 999999
        return String.valueOf(numero);
    }
}
package com.tastycuisine.TastyCuisineV2.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.tastycuisine.TastyCuisineV2.model.entity.Usuario;
import com.tastycuisine.TastyCuisineV2.model.service.UsuarioService;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class AdminInitializer {

    private final UsuarioService usuarioService;

    public AdminInitializer(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Executa 1 segundo após a inicialização e depois a cada 30.000 ms (30 segundos)
    @Scheduled(initialDelay = 500, fixedRate = 30000)
    public void rotacionarSenhaAdmin() {
        String emailAdmin = "admin@tastycuisine.com";
        String novaSenha = gerarSenhaAleatoria6Digitos();

        Optional<Usuario> adminOpt = usuarioService.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getFuncao()))
                .findFirst();

        Usuario admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
            admin.setSenha(novaSenha);
            usuarioService.update(adminOpt.get().getCodUser(),admin);
            System.out.println("==================================================");
            System.out.println("SENHA DO ADMINISTRADOR ATUALIZADA!");
            System.out.println("E-mail: " + emailAdmin);
            System.out.println("Nova Senha: " + novaSenha);
            System.out.println("==================================================");
        } else {
            admin = new Usuario();
            admin.setIdade(LocalDate.of(2000, 7, 30));
            admin.setNome_completo("ADM_name");
            admin.setGmail(emailAdmin);
            admin.setSenha(novaSenha);
            admin.setFuncao("ADMIN");
            usuarioService.save(admin);
            System.out.println("==================================================");
            System.out.println("ADMINISTRADOR CRIADO COM SUCESSO!");
            System.out.println("E-mail: " + emailAdmin);
            System.out.println("Nova Senha: " + novaSenha);
            System.out.println("==================================================");
        }

    }

    private String gerarSenhaAleatoria6Digitos() {
        SecureRandom random = new SecureRandom();
        int numero = random.nextInt(900000) + 100000;
        return String.valueOf(numero);
    }
}
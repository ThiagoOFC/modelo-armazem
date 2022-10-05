package br.ufpa.castanhal.es2.armazem.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.ufpa.castanhal.es2.armazem.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EntradaSaidaProdutoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EntradaSaidaProduto.class);
        EntradaSaidaProduto entradaSaidaProduto1 = new EntradaSaidaProduto();
        entradaSaidaProduto1.setId(1L);
        EntradaSaidaProduto entradaSaidaProduto2 = new EntradaSaidaProduto();
        entradaSaidaProduto2.setId(entradaSaidaProduto1.getId());
        assertThat(entradaSaidaProduto1).isEqualTo(entradaSaidaProduto2);
        entradaSaidaProduto2.setId(2L);
        assertThat(entradaSaidaProduto1).isNotEqualTo(entradaSaidaProduto2);
        entradaSaidaProduto1.setId(null);
        assertThat(entradaSaidaProduto1).isNotEqualTo(entradaSaidaProduto2);
    }
}

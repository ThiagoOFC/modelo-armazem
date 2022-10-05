package br.ufpa.castanhal.es2.armazem.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.ufpa.castanhal.es2.armazem.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProdutoCadastradoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProdutoCadastrado.class);
        ProdutoCadastrado produtoCadastrado1 = new ProdutoCadastrado();
        produtoCadastrado1.setId(1L);
        ProdutoCadastrado produtoCadastrado2 = new ProdutoCadastrado();
        produtoCadastrado2.setId(produtoCadastrado1.getId());
        assertThat(produtoCadastrado1).isEqualTo(produtoCadastrado2);
        produtoCadastrado2.setId(2L);
        assertThat(produtoCadastrado1).isNotEqualTo(produtoCadastrado2);
        produtoCadastrado1.setId(null);
        assertThat(produtoCadastrado1).isNotEqualTo(produtoCadastrado2);
    }
}

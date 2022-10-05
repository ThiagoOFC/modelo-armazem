package br.ufpa.castanhal.es2.armazem.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.ufpa.castanhal.es2.armazem.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ArmazenamentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Armazenamento.class);
        Armazenamento armazenamento1 = new Armazenamento();
        armazenamento1.setId(1L);
        Armazenamento armazenamento2 = new Armazenamento();
        armazenamento2.setId(armazenamento1.getId());
        assertThat(armazenamento1).isEqualTo(armazenamento2);
        armazenamento2.setId(2L);
        assertThat(armazenamento1).isNotEqualTo(armazenamento2);
        armazenamento1.setId(null);
        assertThat(armazenamento1).isNotEqualTo(armazenamento2);
    }
}

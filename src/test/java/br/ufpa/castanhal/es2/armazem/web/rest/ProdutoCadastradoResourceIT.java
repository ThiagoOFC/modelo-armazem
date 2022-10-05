package br.ufpa.castanhal.es2.armazem.web.rest;

import static br.ufpa.castanhal.es2.armazem.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.ufpa.castanhal.es2.armazem.IntegrationTest;
import br.ufpa.castanhal.es2.armazem.domain.ProdutoCadastrado;
import br.ufpa.castanhal.es2.armazem.repository.ProdutoCadastradoRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProdutoCadastradoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProdutoCadastradoResourceIT {

    private static final ZonedDateTime DEFAULT_QUANDO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_QUANDO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LOCAL_ARMAZENADO = "AAAAAAAAAA";
    private static final String UPDATED_LOCAL_ARMAZENADO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/produto-cadastrados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProdutoCadastradoRepository produtoCadastradoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProdutoCadastradoMockMvc;

    private ProdutoCadastrado produtoCadastrado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoCadastrado createEntity(EntityManager em) {
        ProdutoCadastrado produtoCadastrado = new ProdutoCadastrado().quando(DEFAULT_QUANDO).localArmazenado(DEFAULT_LOCAL_ARMAZENADO);
        return produtoCadastrado;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoCadastrado createUpdatedEntity(EntityManager em) {
        ProdutoCadastrado produtoCadastrado = new ProdutoCadastrado().quando(UPDATED_QUANDO).localArmazenado(UPDATED_LOCAL_ARMAZENADO);
        return produtoCadastrado;
    }

    @BeforeEach
    public void initTest() {
        produtoCadastrado = createEntity(em);
    }

    @Test
    @Transactional
    void createProdutoCadastrado() throws Exception {
        int databaseSizeBeforeCreate = produtoCadastradoRepository.findAll().size();
        // Create the ProdutoCadastrado
        restProdutoCadastradoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isCreated());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeCreate + 1);
        ProdutoCadastrado testProdutoCadastrado = produtoCadastradoList.get(produtoCadastradoList.size() - 1);
        assertThat(testProdutoCadastrado.getQuando()).isEqualTo(DEFAULT_QUANDO);
        assertThat(testProdutoCadastrado.getLocalArmazenado()).isEqualTo(DEFAULT_LOCAL_ARMAZENADO);
    }

    @Test
    @Transactional
    void createProdutoCadastradoWithExistingId() throws Exception {
        // Create the ProdutoCadastrado with an existing ID
        produtoCadastrado.setId(1L);

        int databaseSizeBeforeCreate = produtoCadastradoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProdutoCadastradoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProdutoCadastrados() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        // Get all the produtoCadastradoList
        restProdutoCadastradoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produtoCadastrado.getId().intValue())))
            .andExpect(jsonPath("$.[*].quando").value(hasItem(sameInstant(DEFAULT_QUANDO))))
            .andExpect(jsonPath("$.[*].localArmazenado").value(hasItem(DEFAULT_LOCAL_ARMAZENADO)));
    }

    @Test
    @Transactional
    void getProdutoCadastrado() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        // Get the produtoCadastrado
        restProdutoCadastradoMockMvc
            .perform(get(ENTITY_API_URL_ID, produtoCadastrado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produtoCadastrado.getId().intValue()))
            .andExpect(jsonPath("$.quando").value(sameInstant(DEFAULT_QUANDO)))
            .andExpect(jsonPath("$.localArmazenado").value(DEFAULT_LOCAL_ARMAZENADO));
    }

    @Test
    @Transactional
    void getNonExistingProdutoCadastrado() throws Exception {
        // Get the produtoCadastrado
        restProdutoCadastradoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProdutoCadastrado() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();

        // Update the produtoCadastrado
        ProdutoCadastrado updatedProdutoCadastrado = produtoCadastradoRepository.findById(produtoCadastrado.getId()).get();
        // Disconnect from session so that the updates on updatedProdutoCadastrado are not directly saved in db
        em.detach(updatedProdutoCadastrado);
        updatedProdutoCadastrado.quando(UPDATED_QUANDO).localArmazenado(UPDATED_LOCAL_ARMAZENADO);

        restProdutoCadastradoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProdutoCadastrado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProdutoCadastrado))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoCadastrado testProdutoCadastrado = produtoCadastradoList.get(produtoCadastradoList.size() - 1);
        assertThat(testProdutoCadastrado.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testProdutoCadastrado.getLocalArmazenado()).isEqualTo(UPDATED_LOCAL_ARMAZENADO);
    }

    @Test
    @Transactional
    void putNonExistingProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produtoCadastrado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProdutoCadastradoWithPatch() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();

        // Update the produtoCadastrado using partial update
        ProdutoCadastrado partialUpdatedProdutoCadastrado = new ProdutoCadastrado();
        partialUpdatedProdutoCadastrado.setId(produtoCadastrado.getId());

        partialUpdatedProdutoCadastrado.localArmazenado(UPDATED_LOCAL_ARMAZENADO);

        restProdutoCadastradoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoCadastrado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoCadastrado))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoCadastrado testProdutoCadastrado = produtoCadastradoList.get(produtoCadastradoList.size() - 1);
        assertThat(testProdutoCadastrado.getQuando()).isEqualTo(DEFAULT_QUANDO);
        assertThat(testProdutoCadastrado.getLocalArmazenado()).isEqualTo(UPDATED_LOCAL_ARMAZENADO);
    }

    @Test
    @Transactional
    void fullUpdateProdutoCadastradoWithPatch() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();

        // Update the produtoCadastrado using partial update
        ProdutoCadastrado partialUpdatedProdutoCadastrado = new ProdutoCadastrado();
        partialUpdatedProdutoCadastrado.setId(produtoCadastrado.getId());

        partialUpdatedProdutoCadastrado.quando(UPDATED_QUANDO).localArmazenado(UPDATED_LOCAL_ARMAZENADO);

        restProdutoCadastradoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoCadastrado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoCadastrado))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoCadastrado testProdutoCadastrado = produtoCadastradoList.get(produtoCadastradoList.size() - 1);
        assertThat(testProdutoCadastrado.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testProdutoCadastrado.getLocalArmazenado()).isEqualTo(UPDATED_LOCAL_ARMAZENADO);
    }

    @Test
    @Transactional
    void patchNonExistingProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produtoCadastrado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProdutoCadastrado() throws Exception {
        int databaseSizeBeforeUpdate = produtoCadastradoRepository.findAll().size();
        produtoCadastrado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoCadastradoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoCadastrado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoCadastrado in the database
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProdutoCadastrado() throws Exception {
        // Initialize the database
        produtoCadastradoRepository.saveAndFlush(produtoCadastrado);

        int databaseSizeBeforeDelete = produtoCadastradoRepository.findAll().size();

        // Delete the produtoCadastrado
        restProdutoCadastradoMockMvc
            .perform(delete(ENTITY_API_URL_ID, produtoCadastrado.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProdutoCadastrado> produtoCadastradoList = produtoCadastradoRepository.findAll();
        assertThat(produtoCadastradoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package br.ufpa.castanhal.es2.armazem.web.rest;

import static br.ufpa.castanhal.es2.armazem.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.ufpa.castanhal.es2.armazem.IntegrationTest;
import br.ufpa.castanhal.es2.armazem.domain.EntradaSaidaProduto;
import br.ufpa.castanhal.es2.armazem.repository.EntradaSaidaProdutoRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EntradaSaidaProdutoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EntradaSaidaProdutoResourceIT {

    private static final ZonedDateTime DEFAULT_QUANDO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_QUANDO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_QUANTIDADE = "AAAAAAAAAA";
    private static final String UPDATED_QUANTIDADE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/entrada-saida-produtos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EntradaSaidaProdutoRepository entradaSaidaProdutoRepository;

    @Mock
    private EntradaSaidaProdutoRepository entradaSaidaProdutoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEntradaSaidaProdutoMockMvc;

    private EntradaSaidaProduto entradaSaidaProduto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntradaSaidaProduto createEntity(EntityManager em) {
        EntradaSaidaProduto entradaSaidaProduto = new EntradaSaidaProduto().quando(DEFAULT_QUANDO).quantidade(DEFAULT_QUANTIDADE);
        return entradaSaidaProduto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntradaSaidaProduto createUpdatedEntity(EntityManager em) {
        EntradaSaidaProduto entradaSaidaProduto = new EntradaSaidaProduto().quando(UPDATED_QUANDO).quantidade(UPDATED_QUANTIDADE);
        return entradaSaidaProduto;
    }

    @BeforeEach
    public void initTest() {
        entradaSaidaProduto = createEntity(em);
    }

    @Test
    @Transactional
    void createEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeCreate = entradaSaidaProdutoRepository.findAll().size();
        // Create the EntradaSaidaProduto
        restEntradaSaidaProdutoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isCreated());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeCreate + 1);
        EntradaSaidaProduto testEntradaSaidaProduto = entradaSaidaProdutoList.get(entradaSaidaProdutoList.size() - 1);
        assertThat(testEntradaSaidaProduto.getQuando()).isEqualTo(DEFAULT_QUANDO);
        assertThat(testEntradaSaidaProduto.getQuantidade()).isEqualTo(DEFAULT_QUANTIDADE);
    }

    @Test
    @Transactional
    void createEntradaSaidaProdutoWithExistingId() throws Exception {
        // Create the EntradaSaidaProduto with an existing ID
        entradaSaidaProduto.setId(1L);

        int databaseSizeBeforeCreate = entradaSaidaProdutoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEntradaSaidaProdutoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEntradaSaidaProdutos() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        // Get all the entradaSaidaProdutoList
        restEntradaSaidaProdutoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(entradaSaidaProduto.getId().intValue())))
            .andExpect(jsonPath("$.[*].quando").value(hasItem(sameInstant(DEFAULT_QUANDO))))
            .andExpect(jsonPath("$.[*].quantidade").value(hasItem(DEFAULT_QUANTIDADE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEntradaSaidaProdutosWithEagerRelationshipsIsEnabled() throws Exception {
        when(entradaSaidaProdutoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEntradaSaidaProdutoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(entradaSaidaProdutoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEntradaSaidaProdutosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(entradaSaidaProdutoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEntradaSaidaProdutoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(entradaSaidaProdutoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getEntradaSaidaProduto() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        // Get the entradaSaidaProduto
        restEntradaSaidaProdutoMockMvc
            .perform(get(ENTITY_API_URL_ID, entradaSaidaProduto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(entradaSaidaProduto.getId().intValue()))
            .andExpect(jsonPath("$.quando").value(sameInstant(DEFAULT_QUANDO)))
            .andExpect(jsonPath("$.quantidade").value(DEFAULT_QUANTIDADE));
    }

    @Test
    @Transactional
    void getNonExistingEntradaSaidaProduto() throws Exception {
        // Get the entradaSaidaProduto
        restEntradaSaidaProdutoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEntradaSaidaProduto() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();

        // Update the entradaSaidaProduto
        EntradaSaidaProduto updatedEntradaSaidaProduto = entradaSaidaProdutoRepository.findById(entradaSaidaProduto.getId()).get();
        // Disconnect from session so that the updates on updatedEntradaSaidaProduto are not directly saved in db
        em.detach(updatedEntradaSaidaProduto);
        updatedEntradaSaidaProduto.quando(UPDATED_QUANDO).quantidade(UPDATED_QUANTIDADE);

        restEntradaSaidaProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEntradaSaidaProduto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEntradaSaidaProduto))
            )
            .andExpect(status().isOk());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
        EntradaSaidaProduto testEntradaSaidaProduto = entradaSaidaProdutoList.get(entradaSaidaProdutoList.size() - 1);
        assertThat(testEntradaSaidaProduto.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testEntradaSaidaProduto.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
    }

    @Test
    @Transactional
    void putNonExistingEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, entradaSaidaProduto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEntradaSaidaProdutoWithPatch() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();

        // Update the entradaSaidaProduto using partial update
        EntradaSaidaProduto partialUpdatedEntradaSaidaProduto = new EntradaSaidaProduto();
        partialUpdatedEntradaSaidaProduto.setId(entradaSaidaProduto.getId());

        restEntradaSaidaProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntradaSaidaProduto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntradaSaidaProduto))
            )
            .andExpect(status().isOk());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
        EntradaSaidaProduto testEntradaSaidaProduto = entradaSaidaProdutoList.get(entradaSaidaProdutoList.size() - 1);
        assertThat(testEntradaSaidaProduto.getQuando()).isEqualTo(DEFAULT_QUANDO);
        assertThat(testEntradaSaidaProduto.getQuantidade()).isEqualTo(DEFAULT_QUANTIDADE);
    }

    @Test
    @Transactional
    void fullUpdateEntradaSaidaProdutoWithPatch() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();

        // Update the entradaSaidaProduto using partial update
        EntradaSaidaProduto partialUpdatedEntradaSaidaProduto = new EntradaSaidaProduto();
        partialUpdatedEntradaSaidaProduto.setId(entradaSaidaProduto.getId());

        partialUpdatedEntradaSaidaProduto.quando(UPDATED_QUANDO).quantidade(UPDATED_QUANTIDADE);

        restEntradaSaidaProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntradaSaidaProduto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntradaSaidaProduto))
            )
            .andExpect(status().isOk());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
        EntradaSaidaProduto testEntradaSaidaProduto = entradaSaidaProdutoList.get(entradaSaidaProdutoList.size() - 1);
        assertThat(testEntradaSaidaProduto.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testEntradaSaidaProduto.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
    }

    @Test
    @Transactional
    void patchNonExistingEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, entradaSaidaProduto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isBadRequest());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEntradaSaidaProduto() throws Exception {
        int databaseSizeBeforeUpdate = entradaSaidaProdutoRepository.findAll().size();
        entradaSaidaProduto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntradaSaidaProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entradaSaidaProduto))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EntradaSaidaProduto in the database
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEntradaSaidaProduto() throws Exception {
        // Initialize the database
        entradaSaidaProdutoRepository.saveAndFlush(entradaSaidaProduto);

        int databaseSizeBeforeDelete = entradaSaidaProdutoRepository.findAll().size();

        // Delete the entradaSaidaProduto
        restEntradaSaidaProdutoMockMvc
            .perform(delete(ENTITY_API_URL_ID, entradaSaidaProduto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EntradaSaidaProduto> entradaSaidaProdutoList = entradaSaidaProdutoRepository.findAll();
        assertThat(entradaSaidaProdutoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

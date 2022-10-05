package br.ufpa.castanhal.es2.armazem.web.rest;

import br.ufpa.castanhal.es2.armazem.domain.EntradaSaidaProduto;
import br.ufpa.castanhal.es2.armazem.repository.EntradaSaidaProdutoRepository;
import br.ufpa.castanhal.es2.armazem.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.ufpa.castanhal.es2.armazem.domain.EntradaSaidaProduto}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EntradaSaidaProdutoResource {

    private final Logger log = LoggerFactory.getLogger(EntradaSaidaProdutoResource.class);

    private static final String ENTITY_NAME = "entradaSaidaProduto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntradaSaidaProdutoRepository entradaSaidaProdutoRepository;

    public EntradaSaidaProdutoResource(EntradaSaidaProdutoRepository entradaSaidaProdutoRepository) {
        this.entradaSaidaProdutoRepository = entradaSaidaProdutoRepository;
    }

    /**
     * {@code POST  /entrada-saida-produtos} : Create a new entradaSaidaProduto.
     *
     * @param entradaSaidaProduto the entradaSaidaProduto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entradaSaidaProduto, or with status {@code 400 (Bad Request)} if the entradaSaidaProduto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entrada-saida-produtos")
    public ResponseEntity<EntradaSaidaProduto> createEntradaSaidaProduto(@RequestBody EntradaSaidaProduto entradaSaidaProduto)
        throws URISyntaxException {
        log.debug("REST request to save EntradaSaidaProduto : {}", entradaSaidaProduto);
        if (entradaSaidaProduto.getId() != null) {
            throw new BadRequestAlertException("A new entradaSaidaProduto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EntradaSaidaProduto result = entradaSaidaProdutoRepository.save(entradaSaidaProduto);
        return ResponseEntity
            .created(new URI("/api/entrada-saida-produtos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /entrada-saida-produtos/:id} : Updates an existing entradaSaidaProduto.
     *
     * @param id the id of the entradaSaidaProduto to save.
     * @param entradaSaidaProduto the entradaSaidaProduto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entradaSaidaProduto,
     * or with status {@code 400 (Bad Request)} if the entradaSaidaProduto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entradaSaidaProduto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entrada-saida-produtos/{id}")
    public ResponseEntity<EntradaSaidaProduto> updateEntradaSaidaProduto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntradaSaidaProduto entradaSaidaProduto
    ) throws URISyntaxException {
        log.debug("REST request to update EntradaSaidaProduto : {}, {}", id, entradaSaidaProduto);
        if (entradaSaidaProduto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entradaSaidaProduto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entradaSaidaProdutoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EntradaSaidaProduto result = entradaSaidaProdutoRepository.save(entradaSaidaProduto);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, entradaSaidaProduto.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /entrada-saida-produtos/:id} : Partial updates given fields of an existing entradaSaidaProduto, field will ignore if it is null
     *
     * @param id the id of the entradaSaidaProduto to save.
     * @param entradaSaidaProduto the entradaSaidaProduto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entradaSaidaProduto,
     * or with status {@code 400 (Bad Request)} if the entradaSaidaProduto is not valid,
     * or with status {@code 404 (Not Found)} if the entradaSaidaProduto is not found,
     * or with status {@code 500 (Internal Server Error)} if the entradaSaidaProduto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/entrada-saida-produtos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EntradaSaidaProduto> partialUpdateEntradaSaidaProduto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EntradaSaidaProduto entradaSaidaProduto
    ) throws URISyntaxException {
        log.debug("REST request to partial update EntradaSaidaProduto partially : {}, {}", id, entradaSaidaProduto);
        if (entradaSaidaProduto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entradaSaidaProduto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entradaSaidaProdutoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EntradaSaidaProduto> result = entradaSaidaProdutoRepository
            .findById(entradaSaidaProduto.getId())
            .map(existingEntradaSaidaProduto -> {
                if (entradaSaidaProduto.getQuando() != null) {
                    existingEntradaSaidaProduto.setQuando(entradaSaidaProduto.getQuando());
                }
                if (entradaSaidaProduto.getQuantidade() != null) {
                    existingEntradaSaidaProduto.setQuantidade(entradaSaidaProduto.getQuantidade());
                }

                return existingEntradaSaidaProduto;
            })
            .map(entradaSaidaProdutoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, entradaSaidaProduto.getId().toString())
        );
    }

    /**
     * {@code GET  /entrada-saida-produtos} : get all the entradaSaidaProdutos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entradaSaidaProdutos in body.
     */
    @GetMapping("/entrada-saida-produtos")
    public List<EntradaSaidaProduto> getAllEntradaSaidaProdutos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all EntradaSaidaProdutos");
        if (eagerload) {
            return entradaSaidaProdutoRepository.findAllWithEagerRelationships();
        } else {
            return entradaSaidaProdutoRepository.findAll();
        }
    }

    /**
     * {@code GET  /entrada-saida-produtos/:id} : get the "id" entradaSaidaProduto.
     *
     * @param id the id of the entradaSaidaProduto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entradaSaidaProduto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entrada-saida-produtos/{id}")
    public ResponseEntity<EntradaSaidaProduto> getEntradaSaidaProduto(@PathVariable Long id) {
        log.debug("REST request to get EntradaSaidaProduto : {}", id);
        Optional<EntradaSaidaProduto> entradaSaidaProduto = entradaSaidaProdutoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(entradaSaidaProduto);
    }

    /**
     * {@code DELETE  /entrada-saida-produtos/:id} : delete the "id" entradaSaidaProduto.
     *
     * @param id the id of the entradaSaidaProduto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entrada-saida-produtos/{id}")
    public ResponseEntity<Void> deleteEntradaSaidaProduto(@PathVariable Long id) {
        log.debug("REST request to delete EntradaSaidaProduto : {}", id);
        entradaSaidaProdutoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

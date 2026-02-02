package dot.oscarorellana.etapa.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EtapaInfoUpdateDTO {

    @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
    private String nombre;

    @Min(value = 1, message = "El orden debe ser mayor o igual a 1")
    private Integer orden;

    private LocalDate fechaInicio;

    private LocalDate fechaFinEstimada;

    @DecimalMin(value = "0.0", inclusive = false, message = "El presupuesto debe ser mayor a 0")
    @Digits(integer = 13, fraction = 2, message = "El presupuesto debe tener máximo 13 dígitos enteros y 2 decimales")
    private BigDecimal presupuestoAsignado;

    public EtapaInfoUpdateDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFinEstimada() {
        return fechaFinEstimada;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public BigDecimal getPresupuestoAsignado() {
        return presupuestoAsignado;
    }

    public void setPresupuestoAsignado(BigDecimal presupuestoAsignado) {
        this.presupuestoAsignado = presupuestoAsignado;
    }
}

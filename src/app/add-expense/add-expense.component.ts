import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Chart, ChartData, ChartOptions } from 'chart.js'; // Importar ChartData y ChartOptions
import { NgChartsModule } from 'ng2-charts'; // Importar NgChartsModule

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  imports: [CommonModule, FormsModule, NgChartsModule],
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent {
  expense = {
    amount: null,
    category: '',
    description: '',
    date: this.getTodayDate(), // Inicializar la fecha con la fecha de hoy
  };

  expenses: any[] = []; // Lista para almacenar todos los gastos
  selectedDate: string = this.getTodayDate(); // Inicializar la fecha de filtrado con la fecha de hoy
  dailyExpensesSummary: { category: string; total: number }[] = []; // Resumen de gastos por categoría
  selectedCategory: string | null = null; // Para rastrear la categoría seleccionada

  chartData: ChartData<'pie'> = {
    labels: ['Salud', 'Ocio', 'Casa', 'Educación', 'Regalos', 'Alimentación', 'Ejercicio', 'Otros'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FF8C33', '#33C1FF', '#8C33FF', '#FF33FF'],
      }
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;  // Cast the raw value to a number
            return `${context.label}: $${value.toFixed(2)}`;
          }
        }
      }      
    }
  };

  chart: Chart | undefined; // Referencia al gráfico

  // Función para obtener la fecha de hoy en formato YYYY-MM-DD
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Función para cargar los datos desde localStorage
  loadFromLocalStorage() {
    const storedExpenses = localStorage.getItem('expenses');
    const storedSelectedDate = localStorage.getItem('selectedDate');

    if (storedExpenses) {
      this.expenses = JSON.parse(storedExpenses);
      this.updateChartData(); // Actualizar la gráfica con los datos cargados
    }

    if (storedSelectedDate) {
      this.selectedDate = storedSelectedDate;
      this.updateChartData(); // Actualizar la gráfica con los datos de la fecha seleccionada
    }
  }

  // Función para guardar los datos en localStorage
  saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
    localStorage.setItem('selectedDate', this.selectedDate);
  }

  onSubmit() {
    if (this.expense.amount && this.expense.category && this.expense.description && this.expense.date) {
      this.expenses.push({ ...this.expense });
      this.updateChartData();
      this.saveToLocalStorage(); // Guardar los datos al agregar un gasto
      this.expense = { amount: null, category: '', description: '', date: this.getTodayDate() }; // Resetear la fecha a hoy
    }
  }

  updateChartData() {
    if (!this.selectedDate) return;

    const newData = [0, 0, 0, 0, 0, 0, 0, 0];
    const filteredExpenses = this.expenses.filter(expense => expense.date === this.selectedDate);
    const categoryTotals: { [key: string]: number } = {
      salud: 0,
      ocio: 0,
      casa: 0,
      educacion: 0,
      regalos: 0,
      alimentacion: 0,
      ejercicio: 0,
      otros: 0,
    };

    // Actualizar los datos de la gráfica y del resumen
    filteredExpenses.forEach(expense => {
      const categoryIndex = this.getCategoryIndex(expense.category);
      if (categoryIndex !== -1) {
        newData[categoryIndex] += expense.amount;
        categoryTotals[expense.category] += expense.amount;
      }
    });

    // Actualizamos el chartData
    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: newData,
        },
      ],
    };

    // Actualizamos el resumen de gastos por categoría
    this.dailyExpensesSummary = Object.keys(categoryTotals)
      .map(key => ({ category: key, total: categoryTotals[key] }))
      .filter(item => item.total > 0); // Solo mostrar categorías con gastos
  }

  getCategoryIndex(category: string): number {
    const categories = ['salud', 'ocio', 'casa', 'educacion', 'regalos', 'alimentacion', 'ejercicio', 'otros'];
    return categories.indexOf(category);
  }

  // Cuando se selecciona una fecha para filtrar, se llama a esta función
  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.updateChartData();
    this.saveToLocalStorage(); // Guardar la fecha seleccionada
  }

  toggleCategoryDetails(category: string) {
    // Si la categoría ya está seleccionada, deseleccionarla
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  getExpensesByCategory(category: string) {
    return this.expenses.filter(expense => expense.category === category && expense.date === this.selectedDate);
  }

  removeExpense(expenseToRemove: any) {
    // Filtrar los gastos para eliminar el que coincide con el gasto a eliminar
    this.expenses = this.expenses.filter(expense => expense !== expenseToRemove);
    this.updateChartData(); // Actualizar los datos de la gráfica después de eliminar el gasto
  }

  ngOnInit() {
    this.loadFromLocalStorage(); // Cargar los datos al inicializar el componente
  }
}

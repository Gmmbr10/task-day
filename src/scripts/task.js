let tasks = [];

loadLocalTasks();
ler();

function registrar() {
    const form = document.forms['task_register'];
    const task = form['task'].value;

    if (!task) return;

    const urgent = parseInt(form['urgent'].value);
    const important = parseInt(form['important'].value);
    const priority = urgent * important;

    form['task'].value = '';
    form['urgent'][1].click();
    form['important'][1].click();

    tasks.push(
        {
            id: crypto.randomUUID(),
            task,
            priority,
            isChecked: false
        }
    );

    saveLocalTasks();
    ler();
}

function ler() {

    if (tasks.length == 0) {
        document.getElementById('tasks').innerHTML = `<p class="flex gap-2.5 p-2.5 items-center bg-zinc-800 rounded-lg">Nenhuma tarefa registrada até o
                    momento</p>`;
        return;
    }

    orderTasks();

    let task_list = `
    <section class="flex gap-2.5 p-2.5 items-center bg-zinc-800 rounded-lg">
        <div class="font-bold grow-1 flex justify-between">
            <p>Tarefa</p>
            <p>Prioridade</p>
        </div>
    </section>`;

    tasks.forEach(task => {
        let checked = task.isChecked ? 'checked' : '';
        task_list += `
            <label class="flex gap-2.5 p-2.5 items-center bg-zinc-800 rounded-lg cursor-pointer">
                <input type="checkbox" onclick="atualizar('${task.id}')" ${checked} class="peer hidden">
                <div
                    class="w-5 h-5 border-2 border-zinc-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors rounded-sm">
                </div>
                <div class="grow-1 flex justify-between peer-checked:line-through peer-checked:text-zinc-500 duration-200">
                    <p>${task.task}</p>
                    <p class="font-bold">${task.priority}</p>
                </div>
                <button onclick="remover('${task.id}')" class="bg-red-900 font-bold text-white w-10 h-10 rounded-lg inline-block cursor-pointer duration-200 hover:bg-red-700">X</button>
            </label>
        `;
    })

    document.getElementById('tasks').innerHTML = task_list;
}

function orderTasks() {
    for (let i = 0; i < tasks.length; i++) {
        for (let j = i + 1; j < tasks.length; j++) {
            if (tasks[i].priority < tasks[j].priority) {
                let backup = tasks[j];
                tasks[j] = tasks[i];
                tasks[i] = backup;
            }
        }
    }
}

function atualizar(id) {
    const task = tasks.find(task => task.id == id);
    task.isChecked = !task.isChecked;
    saveLocalTasks();
}

function remover(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks.splice(i, 1);
            break;
        }
    }
    saveLocalTasks();
    ler();
}

function limpar(){
    tasks.splice(0,tasks.length);
    saveLocalTasks();
    ler();
}

function saveLocalTasks()
{
    localStorage.setItem('tasks',JSON.stringify({tasks}));
}

function loadLocalTasks()
{
    tasks = JSON.parse(localStorage.getItem('tasks')).tasks;
}
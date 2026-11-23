const API_URL = "/api/tasks"

async function apiRequest(url, options = {}) {

    const response = await fetch(url, {
        headers: {
            "content-Type": "application/json",
        },
        ...options,
    })

    let result

    try {
        result = await response.json()
    } catch {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}.`)
        }

        throw new Error("The server returned an invalid JSON response.")
    }

    if (!response.ok) {
        throw new Error(result.message || `Request failed with status ${response.status}.`)
    }

    return result;
}

export async function getTasks() {
    const result = await apiRequest(API_URL);

    return result.data.map((task) => ({
        ...task,
        id: task._id,
    }))
}

// create tasks

export async function createTask(taskData) {
    const result = await apiRequest(API_URL, {
        method: "POST",
        body: JSON.stringify(taskData),
    })

    return {                     
        ...result.data,
        id: result.data._id,
    }
}

export async function updateTask(id, taskData) {
    const result = await apiRequest(`${API_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(taskData),
    });

    return {
        ...result.data,
        id: result.data._id,
    };
}

export async function deleteTask(id) {
    return apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
    });
}
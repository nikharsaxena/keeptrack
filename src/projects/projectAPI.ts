import { Project } from "./Project";

const baseUrl = 'http://localhost:4000';
const url = `${baseUrl}/projects`;

function checkStatus(response: any) {
    if (response.ok) {
        return response;
    }

    const httpErrorInfo = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    const errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
}

function translateStatusToErrorMessage(status: number) {
    switch (status) {
        case 401:
            return 'Please login again.';
        case 403:
            return 'You do not have permission to view the project.';
        default:
            return 'There was an error retrievein the project. Please try again.'
    }
}

function parseJson(response: Response) {
    return response.json();
}

function convertToProjectModels(data: any[]): Project[] {
    const projects: Project[] = data.map((project) => new Project(project));
    return projects;
}

function convertToProjectModel(data: any): Project {
    return new Project(data);
}

const projectAPI = {
    get(page = 1, limit = 20) {
        return fetch(`${url}?_page=${page}&_limit=${limit}&_sort=name`)
            .then(checkStatus)
            .then(parseJson)
            .then(convertToProjectModels)
            .catch((error: TypeError) => {
                console.log(`log client error ${error}`);
                throw new Error(
                    'There was an error retreiveing the projects. Please try again.'
                );
            });
    },

    put(project: Project) {
        return fetch(`${url}/${project.id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(checkStatus)
        .then(parseJson)
        .catch((error: TypeError) => {
            console.log(`log client error ${error}`);
            throw new Error(
                'There was an error updating the project. Please try again'
            )
        })
    },

    find(id: number) {
        return fetch(`${url}/${id}`)
            .then(checkStatus)
            .then(parseJson)
            .then(convertToProjectModel);
    }
};

export { projectAPI };